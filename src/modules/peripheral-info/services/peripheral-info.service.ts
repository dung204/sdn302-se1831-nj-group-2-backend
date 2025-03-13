import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { PeripheralInfoQueryDto } from '@/modules/peripheral-info/dtos';
import { CreatePeripheralInfoDto } from '@/modules/peripheral-info/dtos/create-peripheral-info.dto';
import {
  DeletedPeripheralInfoDto,
  PeripheralInfoDto,
  deletedPeripheralInfoDto,
  peripheralInfoDto,
} from '@/modules/peripheral-info/dtos/peripheral-info.dto';
import { UpdatePeripheralInfoDto } from '@/modules/peripheral-info/dtos/update-peripheral-info.dto';
import {
  PeripheralInfo,
  PeripheralInfoModel,
} from '@/modules/peripheral-info/models';

class PeripheralInfoService {
  findAllAndCount(
    commonQueryDto: PeripheralInfoQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<PeripheralInfoDto[]>>;
  findAllAndCount(
    commonQueryDto: PeripheralInfoQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedPeripheralInfoDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    name,
    ...rest
  }: PeripheralInfoQueryDto): Promise<
    SuccessResponseBody<PeripheralInfoDto[] | DeletedPeripheralInfoDto[]>
  > {
    const filter: RootFilterQuery<PeripheralInfo> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
      ...rest,
    };

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const query = PeripheralInfoModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const peripheralInfos = await query.exec();

    const total = await PeripheralInfoModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: peripheralInfos.map((peripheralInfo) =>
        deleted
          ? deletedPeripheralInfoDto.parse(peripheralInfo)
          : peripheralInfoDto.parse(peripheralInfo),
      ),
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage,
        },
        sorting,
        filter,
      },
    };
  }

  async findAllDeletedAndCount(peripheralInfoQueryDto: PeripheralInfoQueryDto) {
    return this.findAllAndCount({ ...peripheralInfoQueryDto, deleted: true });
  }

  async findOneById(
    id: string,
  ): Promise<SuccessResponseBody<PeripheralInfoDto>> {
    const peripheralInfo = await PeripheralInfoModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!peripheralInfo) {
      throw new NotFoundException('Peripheral Info not found.');
    }

    return {
      data: peripheralInfoDto.parse(peripheralInfo),
    };
  }

  async createPeripheralInfo(
    createPeripheralInfoDto: CreatePeripheralInfoDto,
  ): Promise<SuccessResponseBody<PeripheralInfoDto>> {
    const newPeripheralInfo = new PeripheralInfoModel(createPeripheralInfoDto);
    return {
      data: peripheralInfoDto.parse(await newPeripheralInfo.save()),
    };
  }

  async updatePeripheralInfo(
    id: string,
    updatePeripheralInfoDto: UpdatePeripheralInfoDto,
  ): Promise<SuccessResponseBody<PeripheralInfoDto>> {
    const updatedPeripheralInfo = await PeripheralInfoModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updatePeripheralInfoDto,
      {
        new: true,
      },
    );

    if (!updatedPeripheralInfo) {
      throw new NotFoundException('Peripheral Info not found.');
    }

    return {
      data: peripheralInfoDto.parse(updatedPeripheralInfo),
    };
  }

  async softDeletePeripheralInfo(id: string) {
    const updateResult = await PeripheralInfoModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'Peripheral Info not found or has been already deleted.',
      );
    }
  }

  async restorePeripheralInfo(
    id: string,
  ): Promise<SuccessResponseBody<PeripheralInfoDto>> {
    const updatedPeripheralInfo = await PeripheralInfoModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedPeripheralInfo) {
      throw new NotFoundException(
        'Peripheral Info not found or has been already restored.',
      );
    }

    return {
      data: peripheralInfoDto.parse(updatedPeripheralInfo),
    };
  }
}

export const peripheralInfoService = new PeripheralInfoService();
