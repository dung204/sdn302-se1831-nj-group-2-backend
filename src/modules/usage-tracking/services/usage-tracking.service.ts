import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  CreateUsageTrackingDto,
  DeletedUsageTrackingDto,
  UpdateUsageTrackingDto,
  UsageTrackingDto,
  UsageTrackingQueryDto,
  deletedUsageTrackingDto,
  usageTrackingDto,
} from '@/modules/usage-tracking/dtos';
import {
  UsageTracking,
  UsageTrackingModel,
} from '@/modules/usage-tracking/models';

class UsageTrackingService {
  // các hàm này sẽ được implement sau -> method: overloading
  findAllAndCount(
    commonQueryDto: UsageTrackingQueryDto & { deleted?: false }, // deleted?:  có nghĩa là deleted có thể không có (undefined) hoặc luôn là false.
  ): Promise<SuccessResponseBody<UsageTrackingDto[]>>;
  findAllAndCount(
    commonQueryDto: UsageTrackingQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedUsageTrackingDto[]>>;

  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: UsageTrackingQueryDto): Promise<
    SuccessResponseBody<UsageTrackingDto[] | DeletedUsageTrackingDto[]>
  > {
    //
    const filter: RootFilterQuery<UsageTracking> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = UsageTrackingModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const usageTrackings = await query.exec();

    const total = await UsageTrackingModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: usageTrackings.map((tracking) =>
        deleted
          ? deletedUsageTrackingDto.parse(tracking)
          : usageTrackingDto.parse(tracking),
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

  async findAllDeletedAndCount(usageTrackingQueryDto: UsageTrackingQueryDto) {
    return this.findAllAndCount({ ...usageTrackingQueryDto, deleted: true });
  }

  async findOneById(
    id: string,
  ): Promise<SuccessResponseBody<HydratedDocument<UsageTracking>>> {
    const usageTracking = await UsageTrackingModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!usageTracking) {
      throw new NotFoundException('usageTracking not found.');
    }

    return {
      data: usageTracking,
    };
  }

  async findOneByUserName() {
    // TODO: Implement this function
  }

  async findOneByComputerName() {
    // TODO: Implement this function
  }

  async findOneByUserId() {
    // TODO: Implement this function
  }
  async findOneByComputerId() {
    // TODO: Implement this function
  }

  //  CUD: create, update, delete
  async createUsageTracking(
    createUsageTrackingDto: CreateUsageTrackingDto,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const newUsageTracking = new UsageTrackingModel(createUsageTrackingDto);

    return {
      data: usageTrackingDto.parse(await newUsageTracking.save()),
    };
  }

  async updateUsageTracking(
    id: string,
    updateUsageTrackingDto: UpdateUsageTrackingDto,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const updatedUsageTracking = await UsageTrackingModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateUsageTrackingDto,
      {
        new: true,
      },
    );

    if (!updatedUsageTracking) {
      throw new NotFoundException('Usage tracking not found.');
    }

    return {
      data: usageTrackingDto.parse(updatedUsageTracking),
    };
  }

  async softDeleteUsageTracking(id: string) {
    const updateResult = await UsageTrackingModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'Usage tracking not found or has been already deleted.',
      );
    }
  }

  async restoreUsageTracking(
    id: string,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const updatedUsageTracking = await UsageTrackingModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
      { new: true },
    );

    if (!updatedUsageTracking) {
      throw new NotFoundException(
        'Usage tracking not found or has been already restored.',
      );
    }

    return {
      data: usageTrackingDto.parse(updatedUsageTracking),
    };
  }
}

export const usageTrackingService = new UsageTrackingService();
