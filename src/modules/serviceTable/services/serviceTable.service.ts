import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  DeletedServiceCategoryDtoDto,
  ServiceCategoryDto,
  deletedServiceCategoryDto,
} from '@/modules/serviceCategory/dtos/ServiceCategory.dto';
import { serviceCategoryService } from '@/modules/serviceCategory/services';

import { CreateServiceTableDto } from '../dtos';
import { ServiceTableQueryDto } from '../dtos/service_table-query.dto';
import { ServiceTableDto, serviceTableDto } from '../dtos/service_table.dto';
import { UpdateServiceTableDto } from '../dtos/update-service_table.dto';
import { ServiceTable, ServiceTableModel } from '../models';

class ServiceTableService {
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: ServiceTableQueryDto): Promise<
    SuccessResponseBody<ServiceCategoryDto[] | DeletedServiceCategoryDtoDto[]>
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

    const serviceCategorys = await query.exec();

    const total = await ServiceTableModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: serviceCategorys.map((user) =>
        deleted
          ? deletedServiceCategoryDto.parse(user)
          : serviceTableDto.parse(user),
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
    const newServiceCategory = new ServiceTableModel(createServiceTableDto);

    await serviceCategoryService.findOneById(newServiceCategory.categoryId!);

    return {
      data: serviceTableDto.parse(await newServiceCategory.save()),
    };
  }
  async updateServiceTable(
    id: string,
    updateTableDto: UpdateServiceTableDto,
  ): Promise<SuccessResponseBody<ServiceTableDto>> {
    await serviceCategoryService.findOneById(updateTableDto.categoryId!);
    const updatedTable = await ServiceTableModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateTableDto,
      {
        new: true,
      },
    );

    if (!updatedTable) {
      throw new NotFoundException('ServiceTable not update.');
    }

    return {
      data: serviceTableDto.parse(updatedTable),
    };
  }
  async softDeleteServiceTable(id: string) {
    const updateResult = await ServiceTableModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'ServiceCategory not found or has been already deleted.',
      );
    }
  }
  async restoreServiceTable(
    id: string,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const updatedServiceCategory = await ServiceTableModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedServiceCategory) {
      throw new NotFoundException(
        'User not found or has been already restored.',
      );
    }

    return {
      data: serviceTableDto.parse(updatedServiceCategory),
    };
  }
}

export const serviceTableService = new ServiceTableService();
