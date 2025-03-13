import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { PeripheralInfoQueryDto } from '@/modules/peripheral/dtos';
import { CreatePeripheralDto } from '@/modules/peripheral/dtos/create-peripheral.dto';
import {
  DeletedPeripheralDto,
  PeripheralDto,
  deletedPeripheralDto,
  peripheralDto,
} from '@/modules/peripheral/dtos/peripheral.dto';
import { UpdatePeripheralDto } from '@/modules/peripheral/dtos/update-peripheral.dto';
import { Peripheral, PeripheralModel } from '@/modules/peripheral/models';

class PeripheralService {
  findAllAndCount(
    commonQueryDto: PeripheralInfoQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<PeripheralDto[]>>;
  findAllAndCount(
    commonQueryDto: PeripheralInfoQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedPeripheralDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    name,
    ...rest
  }: PeripheralInfoQueryDto): Promise<
    SuccessResponseBody<PeripheralDto[] | DeletedPeripheralDto[]>
  > {
    const filter: RootFilterQuery<Peripheral> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
      ...rest,
    };

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const query = PeripheralModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const peripheralInfos = await query.exec();

    const total = await PeripheralModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: peripheralInfos.map((peripheralInfo) =>
        deleted
          ? deletedPeripheralDto.parse(peripheralInfo)
          : peripheralDto.parse(peripheralInfo),
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

  async findOneById(id: string): Promise<SuccessResponseBody<PeripheralDto>> {
    const peripheralInfo = await PeripheralModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!peripheralInfo) {
      throw new NotFoundException('Peripheral Info not found.');
    }

    return {
      data: peripheralDto.parse(peripheralInfo),
    };
  }

  async createPeripheralInfo(
    createPeripheralInfoDto: CreatePeripheralDto,
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const newPeripheralInfo = new PeripheralModel(createPeripheralInfoDto);
    return {
      data: peripheralDto.parse(await newPeripheralInfo.save()),
    };
  }

  async updatePeripheralInfo(
    id: string,
    updatePeripheralInfoDto: UpdatePeripheralDto,
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const updatedPeripheralInfo = await PeripheralModel.findOneAndUpdate(
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
      data: peripheralDto.parse(updatedPeripheralInfo),
    };
  }

  async softDeletePeripheralInfo(id: string) {
    const updateResult = await PeripheralModel.updateOne(
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
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const updatedPeripheralInfo = await PeripheralModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedPeripheralInfo) {
      throw new NotFoundException(
        'Peripheral Info not found or has been already restored.',
      );
    }

    return {
      data: peripheralDto.parse(updatedPeripheralInfo),
    };
  }
}

export const peripheralService = new PeripheralService();
