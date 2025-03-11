import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { serviceCategoryService } from '@/modules/service-category/services';
import {
  CreateServiceTableDto,
  DeletedServiceTableDto,
  ServiceTableDto,
  ServiceTableQueryDto,
  UpdateServiceTableDto,
  deletedServiceTableDto,
  serviceTableDto,
} from '@/modules/service-table/dtos';
import {
  ServiceTable,
  ServiceTableModel,
} from '@/modules/service-table/models';

class ServiceTableService {
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    ...filter
  }: ServiceTableQueryDto): Promise<
    SuccessResponseBody<ServiceTableDto[] | DeletedServiceTableDto[]>
  > {
    const {
      name,
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
      fromPrice,
      toPrice,
      branch,
      ...otherFilters
    } = filter;
    const queryFilter: RootFilterQuery<ServiceTable> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(branch && { branches: { $elemMatch: { $eq: branch } } }),
      ...otherFilters,
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    if (fromPrice || toPrice) {
      queryFilter.price = {
        ...(fromPrice && { $gte: fromPrice }),
        ...(toPrice && { $lte: toPrice }),
      };
    }

    const query = ServiceTableModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const serviceTables = await query.exec();

    const total = await ServiceTableModel.countDocuments(queryFilter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: serviceTables.map((serviceTable) =>
        deleted
          ? deletedServiceTableDto.parse(serviceTable)
          : serviceTableDto.parse(serviceTable),
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
  async findAllDeletedAndCount(serviceCategoryQueryDto: ServiceTableQueryDto) {
    return this.findAllAndCount({ ...serviceCategoryQueryDto, deleted: true });
  }
  async findOneById(id: string): Promise<SuccessResponseBody<ServiceTableDto>> {
    const serviceTable = await ServiceTableModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!serviceTable) {
      throw new NotFoundException('ServiceTable not found.');
    }

    return {
      data: serviceTableDto.parse(serviceTable),
    };
  }

  async createServiceTable(
    createServiceTableDto: CreateServiceTableDto,
  ): Promise<SuccessResponseBody<ServiceTableDto>> {
    const newServiceTable = new ServiceTableModel(createServiceTableDto);

    await serviceCategoryService.findOneById(newServiceTable.category!);

    return {
      data: serviceTableDto.parse(
        await (await newServiceTable.save()).populate(['category']),
      ),
    };
  }
  async updateServiceTable(
    id: string,
    updateTableDto: UpdateServiceTableDto,
  ): Promise<SuccessResponseBody<ServiceTableDto>> {
    if (updateTableDto.category) {
      await serviceCategoryService.findOneById(updateTableDto.category);
    }

    const updatedServiceTable = await ServiceTableModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateTableDto,
      {
        new: true,
      },
    );

    if (!updatedServiceTable) {
      throw new NotFoundException('ServiceTable not update.');
    }

    return {
      data: serviceTableDto.parse(updatedServiceTable),
    };
  }
  async softDeleteServiceTable(id: string) {
    const updateResult = await ServiceTableModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'ServiceTable not found or has been already deleted.',
      );
    }
  }
  async restoreServiceTable(
    id: string,
  ): Promise<SuccessResponseBody<ServiceTableDto>> {
    const updatedServiceTable = await ServiceTableModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedServiceTable) {
      throw new NotFoundException(
        'ServiceTable not found or has been already restored.',
      );
    }

    return {
      data: serviceTableDto.parse(updatedServiceTable),
    };
  }
}

export const serviceTableService = new ServiceTableService();
