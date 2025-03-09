import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  CreateServiceCategoryDto,
  DeletedServiceCategoryDto,
  ServiceCategoryDto,
  ServiceCategoryQueryDto,
  UpdateServiceCategoryDto,
  deletedServiceCategoryDto,
  serviceCategoryDto,
} from '@/modules/service-category/dtos';
import {
  ServiceCategory,
  ServiceCategoryModel,
} from '@/modules/service-category/models';
import { ServiceTableModel } from '@/modules/service-table/models';

class ServiceCategoryService {
  findAllAndCount(
    commonQueryDto: ServiceCategoryQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<ServiceCategoryDto[]>>;
  findAllAndCount(
    commonQueryDto: ServiceCategoryQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedServiceCategoryDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: ServiceCategoryQueryDto): Promise<
    SuccessResponseBody<ServiceCategoryDto[] | DeletedServiceCategoryDto[]>
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

    const serviceCategories = await query.exec();

    const total = await ServiceCategoryModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: serviceCategories.map((user) =>
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
    const serviceCategory = await ServiceCategoryModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!serviceCategory) {
      throw new NotFoundException('ServiceCategory not found.');
    }

    return {
      data: serviceCategoryDto.parse(serviceCategory),
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
    const updatetServiceCategory = await ServiceCategoryModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatetServiceCategory) {
      throw new NotFoundException('ServiceCategory not found.');
    }

    return {
      data: serviceCategoryDto.parse(updatetServiceCategory),
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
    await this.softDeleteByServiceCategoryId(id);
  }
  async softDeleteByServiceCategoryId(categoryId: string) {
    await ServiceTableModel.updateMany(
      { categoryId: categoryId, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );
  }
  async restoreServiceCategory(
    id: string,
  ): Promise<SuccessResponseBody<ServiceCategoryDto>> {
    const restoreServiceCategory = await ServiceCategoryModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!restoreServiceCategory) {
      throw new NotFoundException(
        'ServiceCategory not found or has been already restored.',
      );
    }

    return {
      data: serviceCategoryDto.parse(restoreServiceCategory),
    };
  }
}

export const serviceCategoryService = new ServiceCategoryService();
