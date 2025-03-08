import { SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http';
import { SuccessResponseBody } from '@/base/common/types';
import { ProviderQueryDto } from '@/modules/provider/dtos';
import {
  CreateProviderDto,
  DeletedProviderDto,
  ProviderDto,
  UpdateProviderDto,
  providerDto,
} from '@/modules/provider/dtos';
import { ProviderModel } from '@/modules/provider/models';

class ProviderService {
  findAllAndCount(
    commonQueryDto: ProviderQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<ProviderDto[]>>;
  findAllAndCount(
    commonQueryDto: ProviderQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedProviderDto[]>>;

  async findAllAndCount({
    page,
    pageSize,
    sorting,
    name,
  }: ProviderQueryDto): Promise<SuccessResponseBody<ProviderDto[]>> {
    interface QueryFilter {
      name?: { $regex: string; $options: string };
    }

    const query: QueryFilter = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Lọc theo các điều kiện khác
    const providerQuery = ProviderModel.find(query)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const total = await ProviderModel.countDocuments(query).exec();
    const totalPage = Math.ceil(total / pageSize);

    const providers = await providerQuery.exec();

    return {
      data: providers.map((provider) => providerDto.parse(provider)),
      meta: {
        pagination: {
          total,
          page,
          pageSize,
          totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage,
        },
        sorting,
      },
    };
  }

  async findAllDeletedAndCount(providerQueryDto: ProviderQueryDto) {
    return this.findAllAndCount({ ...providerQueryDto, deleted: true });
  }

  async findOneById(id: string) {
    const provider = await ProviderModel.findOne({
      _id: id,
      deleteTimestamp: null,
    }).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with id:${id} is not found`);
    }

    return {
      data: providerDto.parse(provider),
    };
  }

  async createProvider(
    createProviderDto: CreateProviderDto,
  ): Promise<SuccessResponseBody<ProviderDto>> {
    const provider = new ProviderModel(createProviderDto);
    const newPro = await provider.save();
    return {
      data: providerDto.parse(newPro),
    };
  }

  async updateProvider(
    id: string,
    updateProviderDto: UpdateProviderDto,
  ): Promise<SuccessResponseBody<ProviderDto>> {
    const updatedProvider = await ProviderModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateProviderDto,
      {
        new: true,
      },
    );

    if (!updatedProvider) {
      throw new NotFoundException('Provider not found.');
    }
    return {
      data: providerDto.parse(updatedProvider),
    };
  }

  async softDeleteProvider(id: string) {
    const updateResult = await ProviderModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'Provider not found or has been already deleted.',
      );
    }
  }

  async restoreProvider(id: string): Promise<SuccessResponseBody<ProviderDto>> {
    const updatedProvider = await ProviderModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedProvider) {
      throw new NotFoundException(
        'Provider not found or has been already restored.',
      );
    }

    return {
      data: providerDto.parse(updatedProvider),
    };
  }
}

export const providerService = new ProviderService();
