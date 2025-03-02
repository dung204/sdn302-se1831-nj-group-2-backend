import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  DeletedServiceCategoryDtoDto,
  ServiceCategoryDto,
  deletedServiceCategoryDto,
} from '@/modules/serviceCategory/dtos/ServiceCategory.dto';
import {
  ServiceCategory,
  ServiceCategoryModel,
} from '@/modules/serviceCategory/models';
import { ServiceTableModel } from '@/modules/serviceTable/models';

import { CreateServiceCategoryDto } from '../dtos';
import { ServiceCategoryQueryDto } from '../dtos/ServiceCategory-query.dto';
import { serviceCategoryDto } from '../dtos/ServiceCategory.dto';
import { UpdateServiceCategoryDto } from '../dtos/update-service_table.dto';

class ServiceCategoryService {
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: ServiceCategoryQueryDto): Promise<
    SuccessResponseBody<ServiceCategoryDto[] | DeletedServiceCategoryDtoDto[]>
  > {
    const filter: RootFilterQuery<ServiceCategory> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = ServiceCategoryModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const serviceCategorys = await query.exec();

    const total = await ServiceCategoryModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: serviceCategorys.map((user) =>
        deleted
          ? deletedServiceCategoryDto.parse(user)
          : serviceCategoryDto.parse(user),
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
  async findAllDeletedAndCount(
    serviceCategoryQueryDto: ServiceCategoryQueryDto,
  ) {
    return this.findAllAndCount({ ...serviceCategoryQueryDto, deleted: true });
  }
  async findOneById(
    id: string,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const user = await ServiceCategoryModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!user) {
      throw new NotFoundException('ServiceCategory not found.');
    }

    return {
      data: serviceCategoryDto.parse(user),
    };
  }

  async createServiceCategory(
    createUserDto: CreateServiceCategoryDto,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const newServiceCategory = new ServiceCategoryModel(createUserDto);
    return {
      data: serviceCategoryDto.parse(await newServiceCategory.save()),
    };
  }
  async updateServiceCategory(
    id: string,
    updateUserDto: UpdateServiceCategoryDto,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const updatedUser = await ServiceCategoryModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('ServiceCategory not found.');
    }

    return {
      data: serviceCategoryDto.parse(updatedUser),
    };
  }
  async softDeleteServiceCategory(id: string) {
    const updateResult = await ServiceCategoryModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'ServiceCategory not found or has been already deleted.',
      );
    }
    await this.softDeleteServiceTables(id);
  }
  async softDeleteServiceTables(categoryId: string) {
    await ServiceTableModel.updateMany(
      { categoryId: categoryId, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );
  }
  async restoreServiceCategory(
    id: string,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const updatedServiceCategory = await ServiceCategoryModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedServiceCategory) {
      throw new NotFoundException(
        'User not found or has been already restored.',
      );
    }

    return {
      data: serviceCategoryDto.parse(updatedServiceCategory),
    };
  }
}

export const serviceCategoryService = new ServiceCategoryService();
