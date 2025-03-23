import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { ComputerModel } from '@/modules/computer/models';
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
import { UserModel } from '@/modules/user/models';

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
    ...filter
  }: UsageTrackingQueryDto): Promise<
    SuccessResponseBody<UsageTrackingDto[] | DeletedUsageTrackingDto[]>
  > {
    // handling filter
    const {
      user,
      computer,
      startTimeStamp,
      endTimeStamp,
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
    } = filter;
    //
    const queryFilter: RootFilterQuery<UsageTracking> = {
      // if deleted is false, then deleteTimestamp is null, otherwise deleteTimestamp is not null
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(user && { user }), // search with accurate user ~ id
      ...(computer && { computer }),
      ...(startTimeStamp && { startTimeStamp }), // search with accurate startTimeStamp
      ...(endTimeStamp && { endTimeStamp }),
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    // search between startTimeStamp and endTimeStamp
    if (startTimeStamp && endTimeStamp) {
      // search with startTimeStamp >= startTimeStamp && endTimeStamp <= endTimeStamp
      queryFilter.startTimeStamp = {
        $gte: startTimeStamp,
        $lte: endTimeStamp,
      };
    }

    const query = UsageTrackingModel.find(queryFilter)
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
        filter,
      },
    };
  }

  async findAllDeletedAndCount(usageTrackingQueryDto: UsageTrackingQueryDto) {
    return this.findAllAndCount({ ...usageTrackingQueryDto, deleted: true });
  }

  async findOneById(
    id: string,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const usageTracking = await UsageTrackingModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!usageTracking) {
      throw new NotFoundException('Usage tracking not found.');
    }

    return {
      data: usageTrackingDto.parse(usageTracking),
    };
  }

  //  CUD: create, update, delete
  async createUsageTracking(
    createUsageTrackingDto: CreateUsageTrackingDto,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const user = await UserModel.findById(createUsageTrackingDto.user);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // check computer
    const computer = await ComputerModel.findById(
      createUsageTrackingDto.computer,
    );
    if (!computer) {
      throw new NotFoundException('Computer not found.');
    }

    // create new object usageTracking
    const newUsageTracking = new UsageTrackingModel(createUsageTrackingDto);

    // check createTimeStamp
    // find in db: startTimeStamp (records in bd) <= newUsageTracking.createTimestamp (new) <= endTimeStamp (records in bd)

    // save in db
    const savedUsageTracking = await newUsageTracking.save();

    return {
      data: usageTrackingDto.parse(
        await savedUsageTracking.populate(['user', 'computer']),
      ),
    };
  }

  async updateUsageTracking(
    id: string,
    updateUsageTrackingDto: UpdateUsageTrackingDto,
  ): Promise<SuccessResponseBody<UsageTrackingDto>> {
    const { user, computer } = updateUsageTrackingDto;

    if (
      user &&
      !(await UserModel.exists({ _id: user, deleteTimestamp: null }))
    ) {
      throw new NotFoundException('User not found.');
    }

    if (
      computer &&
      !(await ComputerModel.exists({ _id: computer, deleteTimestamp: null }))
    ) {
      throw new NotFoundException('Computer not found.');
    }

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
