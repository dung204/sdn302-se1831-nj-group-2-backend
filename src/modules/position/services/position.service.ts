import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { ConflictException } from '@/base/common/exceptions';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  DeletedPositionDto,
  PositionDto,
  PositionQueryDto,
  UpdatePositionDto,
  createPositionDto,
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
    createPositionDto: createPositionDto,
  ): Promise<SuccessResponseBody<PositionDto>> {
    const isPositionExisted = await PositionModel.exists({
      name: createPositionDto.name,
    }).exec();

    if (isPositionExisted) {
      throw new ConflictException(
        `A position with name '${createPositionDto.name}' already exists.`,
      );
    }

    const newPosition = new PositionModel(createPositionDto);

    return {
      data: positionDto.parse(await newPosition.save()),
    };
  }

  async updatePosition(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<SuccessResponseBody<PositionDto>> {
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
