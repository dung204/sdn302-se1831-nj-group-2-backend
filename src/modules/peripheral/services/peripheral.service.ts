import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { PeripheralQueryDto } from '@/modules/peripheral/dtos';
import { CreatePeripheralDto } from '@/modules/peripheral/dtos/create-peripheral.dto';
import {
  DeletedPeripheralDto,
  PeripheralDto,
  deletedPeripheralDto,
  peripheralDto,
} from '@/modules/peripheral/dtos/peripheral.dto';
import { UpdatePeripheralDto } from '@/modules/peripheral/dtos/update-peripheral.dto';
import { Peripheral, PeripheralModel } from '@/modules/peripheral/models';
import { ProviderModel } from '@/modules/provider/models';

class PeripheralService {
  findAllAndCount(
    commonQueryDto: PeripheralQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<PeripheralDto[]>>;
  findAllAndCount(
    commonQueryDto: PeripheralQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedPeripheralDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    ...filter
  }: PeripheralQueryDto): Promise<
    SuccessResponseBody<PeripheralDto[] | DeletedPeripheralDto[]>
  > {
    const {
      name,
      brand,
      type,
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
      ...otherFilters
    } = filter;

    const queryFilter: RootFilterQuery<Peripheral> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(brand && { brand: { $regex: brand, $options: 'i' } }),
      ...(type && { type: { $in: type } }),
      ...otherFilters,
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    const query = PeripheralModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const peripheralInfos = await query.exec();

    const total = await PeripheralModel.countDocuments(queryFilter).exec();
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

  async findAllDeletedAndCount(peripheralInfoQueryDto: PeripheralQueryDto) {
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

  async createPeripheral(
    createPeripheralDto: CreatePeripheralDto,
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const { provider } = createPeripheralDto;

    const isProviderExisted = await ProviderModel.exists({
      _id: provider,
      deleteTimestamp: null,
    });
    if (!isProviderExisted) {
      throw new NotFoundException('Provider not found.');
    }

    const newPeripheralInfo = await new PeripheralModel(
      createPeripheralDto,
    ).save();
    return {
      data: peripheralDto.parse(await newPeripheralInfo.populate('provider')),
    };
  }

  async updatePeripheral(
    id: string,
    updatePeripheralDto: UpdatePeripheralDto,
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const { provider } = updatePeripheralDto;

    if (provider) {
      const isProviderExisted = await ProviderModel.exists({
        _id: provider,
        deleteTimestamp: null,
      });
      if (!isProviderExisted) {
        throw new NotFoundException('Provider not found.');
      }
    }

    const updatedPeripheral = await PeripheralModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updatePeripheralDto,
      {
        new: true,
      },
    );

    if (!updatedPeripheral) {
      throw new NotFoundException('Peripheral Info not found.');
    }

    return {
      data: peripheralDto.parse(updatedPeripheral),
    };
  }

  async softDeletePeripheral(id: string) {
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

  async restorePeripheral(
    id: string,
  ): Promise<SuccessResponseBody<PeripheralDto>> {
    const updatedPeripheral = await PeripheralModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedPeripheral) {
      throw new NotFoundException(
        'Peripheral Info not found or has been already restored.',
      );
    }

    return {
      data: peripheralDto.parse(updatedPeripheral),
    };
  }
}

export const peripheralService = new PeripheralService();
