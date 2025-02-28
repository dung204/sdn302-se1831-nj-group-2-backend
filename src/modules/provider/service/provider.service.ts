import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { CreateProviderDto } from '@/modules/provider/dtos/create-provider.dto';
import {
  DeletedProviderDto,
  ProviderDto,
  deletedProviderDto,
  providerDto,
} from '@/modules/provider/dtos/provider.dto';

import { ProviderQueryDto } from '../dtos';
import { UpdateProviderDto } from '../dtos/update-provider.dto';
import { Provider, ProviderModel } from '../models';

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
    deleted,
  }: ProviderQueryDto): Promise<
    SuccessResponseBody<ProviderDto[] | DeletedProviderDto[]>
  > {
    const filter: RootFilterQuery<Provider> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = ProviderModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id:' : field, direction] as [string, SortOrder],
        ),
      );
    const providers = await query.exec();
    const total = await ProviderModel.countDocuments().exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: providers.map((provider) =>
        deleted
          ? deletedProviderDto.parse(provider)
          : providerDto.parse(provider),
      ),
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
    const provider = await ProviderModel.findById(id).exec();
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
        'User not found or has been already deleted.',
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
        'User not found or has been already restored.',
      );
    }

    return {
      data: providerDto.parse(updatedProvider),
    };
  }
}

export const providerService = new ProviderService();
