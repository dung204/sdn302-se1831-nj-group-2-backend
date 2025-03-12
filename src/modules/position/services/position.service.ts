import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { ConflictException } from '@/base/common/exceptions';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { branchService } from '@/modules/branch/services';
import {
  CreatePositionDto,
  DeletedPositionDto,
  PositionDto,
  PositionQueryDto,
  UpdatePositionDto,
  deletedPositionDto,
  positionDto,
} from '@/modules/position/dtos';
import { Position, PositionModel } from '@/modules/position/models';

class PositionService {
  findAllAndCount(
    commonQueryDto: PositionQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<PositionDto[]>>;
  findAllAndCount(
    commonQueryDto: PositionQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedPositionDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    ...filter
  }: PositionQueryDto): Promise<
    SuccessResponseBody<PositionDto[] | DeletedPositionDto[]>
  > {
    const {
      name,
      status,
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
      ...otherFilters
    } = filter;
    const queryFilter: RootFilterQuery<Position> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(status && { status: { $in: status } }),
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...otherFilters,
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    const query = PositionModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const positions = await query.exec();

    const total = await PositionModel.countDocuments(queryFilter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: positions.map((position) =>
        deleted
          ? deletedPositionDto.parse(position)
          : positionDto.parse(position),
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

  findAllDeleted(positionQueryDto: PositionQueryDto) {
    return this.findAllAndCount({ ...positionQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<HydratedDocument<Position>> {
    const position = await PositionModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!position) {
      throw new NotFoundException('Position not found.');
    }

    return position;
  }

  async createPosition(
    createPositionDto: CreatePositionDto,
  ): Promise<SuccessResponseBody<PositionDto>> {
    const isPositionExisted = await PositionModel.exists({
      name: createPositionDto.name,
    }).exec();

    if (isPositionExisted) {
      throw new ConflictException(
        `A position with name '${createPositionDto.name}' already exists.`,
      );
    }

    await branchService.findOneById(createPositionDto.branch);

    const newPosition = await new PositionModel(createPositionDto).save();

    return {
      data: positionDto.parse(
        await newPosition.populate({
          path: 'branch',
        }),
      ),
    };
  }

  async updatePosition(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<SuccessResponseBody<PositionDto>> {
    if (updatePositionDto.branch) {
      await branchService.findOneById(updatePositionDto.branch);
    }

    const position = await PositionModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updatePositionDto,
      { new: true },
    );

    if (!position) {
      throw new NotFoundException('Position not found.');
    }

    return {
      data: positionDto.parse(position),
    };
  }

  softDeletePosition(id: string) {
    return PositionModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );
  }

  async restorePosition(id: string): Promise<SuccessResponseBody<PositionDto>> {
    const updatedPosition = await PositionModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedPosition) {
      throw new NotFoundException(
        'Position not found or has been already restored.',
      );
    }

    return {
      data: positionDto.parse(updatedPosition),
    };
  }
}

export const positionService = new PositionService();
