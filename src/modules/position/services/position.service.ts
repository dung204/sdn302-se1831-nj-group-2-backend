import { RootFilterQuery, SortOrder } from 'mongoose';

import { SuccessResponseBody } from '@/base/common/types';
import { Position, PositionModel } from '@/modules/position/models';

import { createPositionDto } from '../dtos/create-position.dto';
import { PositionQueryDto } from '../dtos/position-query.dto';
import {
  DeletedPositionDto,
  PositionDto,
  deletedPositionDto,
  positionDto,
} from '../dtos/position.dto';

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
  }: PositionQueryDto): Promise<
    SuccessResponseBody<PositionDto[] | DeletedPositionDto[]>
  > {
    const filter: RootFilterQuery<Position> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = PositionModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const positions = await query.exec();

    const total = await PositionModel.countDocuments(filter).exec();
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
      },
    };
  }

  findAllDeleted() {}

  findOneById() {}

  createPosition(positionDto: createPositionDto) {
    const newPosition = new PositionModel(positionDto);
    return newPosition.save();
  }

  updatePosition() {}

  softDeletePosition() {}

  restorePosition() {}
}

export const positionService = new PositionService();
