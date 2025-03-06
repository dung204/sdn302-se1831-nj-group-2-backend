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
  }: ServiceTableQueryDto): Promise<
    SuccessResponseBody<ServiceTableDto[] | DeletedServiceTableDto[]>
  > {
    const filter: RootFilterQuery<ServiceTable> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = ServiceTableModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const serviceTable = await query.exec();

    const total = await ServiceTableModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: serviceTable.map((serviceTable) =>
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

    await serviceCategoryService.findOneById(newServiceTable.categoryId!);

    return {
      data: serviceTableDto.parse(await newServiceTable.save()),
    };
  }
  async updateServiceTable(
    id: string,
    updateTableDto: UpdateServiceTableDto,
  ): Promise<SuccessResponseBody<ServiceTableDto>> {
    await serviceCategoryService.findOneById(updateTableDto.categoryId!);
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
