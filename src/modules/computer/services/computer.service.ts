import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { ConflictException } from '@/base/common/exceptions';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { ComputerQueryDto } from '@/modules/computer/dtos';
import {
  ComputerDto,
  DeletedComputerDto,
  computerDto,
  deletedComputerDto,
} from '@/modules/computer/dtos/computer.dto';
import { CreateComputerDto } from '@/modules/computer/dtos/create-computer.dto';
import { UpdateComputerDto } from '@/modules/computer/dtos/update-computer.dto';
import { Computer, ComputerModel } from '@/modules/computer/models';
import { PositionModel } from '@/modules/position/models';
import { ProviderModel } from '@/modules/provider/models';

class ComputerService {
  findAllAndCount(
    commonQueryDto: ComputerQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<ComputerDto[]>>;
  findAllAndCount(
    commonQueryDto: ComputerQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedComputerDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: ComputerQueryDto): Promise<
    SuccessResponseBody<ComputerDto[] | DeletedComputerDto[]>
  > {
    const filter: RootFilterQuery<Computer> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = ComputerModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      )
      .populate('positionId')
      .populate('providerId');
    const computers = await query.exec();
    const total = await ComputerModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: computers.map((computer) =>
        deleted
          ? deletedComputerDto.parse(computer)
          : computerDto.parse(computer),
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

  async findAllDeletedAndCount(userQueryDto: ComputerQueryDto) {
    return this.findAllAndCount({ ...userQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<HydratedDocument<Computer>> {
    const computer = await ComputerModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!computer) {
      throw new NotFoundException('Computer not found.');
    }

    return computer;
  }

  async createComputer(
    createComputerDto: CreateComputerDto,
  ): Promise<SuccessResponseBody<ComputerDto>> {
    const { name, positionId, providerId } = createComputerDto;

    // Check if the computer already exists
    const isComputerExisted = await ComputerModel.exists({ name }).exec();

    if (isComputerExisted) {
      throw new ConflictException(
        `A computer with name '${name}' already exists.`,
      );
    }

    // Check if the position exists
    const isPositionExisted = await PositionModel.exists({
      _id: positionId,
    }).exec();
    if (!isPositionExisted) {
      throw new NotFoundException(`Position not found.`);
    }

    // Check if the provider exists
    const isProviderExisted = await ProviderModel.exists({
      _id: providerId,
    }).exec();
    if (!isProviderExisted) {
      throw new NotFoundException(`Provider not found.`);
    }

    // Create the new computer
    const newComputer = new ComputerModel(createComputerDto);
    const computerSave = await newComputer.save();
    return {
      data: computerDto.parse(computerSave),
    };
  }

  async updateComputer(
    id: string,
    updateComputerDto: UpdateComputerDto,
  ): Promise<SuccessResponseBody<ComputerDto>> {
    const { positionId, providerId } = updateComputerDto;
    // Check if the computer exists
    const existingComputer = await ComputerModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!existingComputer) {
      throw new NotFoundException('Computer not found.');
    }

    // Check if the position exists (UUID check)
    if (positionId) {
      const isPositionExisted = await PositionModel.exists({
        _id: positionId,
      }).exec();
      if (!isPositionExisted) {
        throw new NotFoundException(
          `Position with id '${positionId}' not found.`,
        );
      }
    }

    if (providerId) {
      const isProviderExisted = await ProviderModel.exists({
        _id: providerId,
      }).exec();
      if (!isProviderExisted) {
        throw new NotFoundException(
          `Provider with id '${providerId}' not found.`,
        );
      }
    }

    const updatedComputer = await ComputerModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateComputerDto,
      { new: true },
    );

    if (!updatedComputer) {
      throw new NotFoundException('Computer not found.');
    }

    return {
      data: computerDto.parse(updatedComputer),
    };
  }

  async softDeleteComputer(id: string) {
    const updatedComputer = await ComputerModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updatedComputer.modifiedCount !== 1) {
      throw new NotFoundException(
        'Computer not found or has been already deleted.',
      );
    }
  }

  async restoreComputer(id: string): Promise<SuccessResponseBody<ComputerDto>> {
    const updatedComputer = await ComputerModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedComputer) {
      throw new NotFoundException(
        'Computer not found or has been already restored.',
      );
    }

    return {
      data: computerDto.parse(updatedComputer),
    };
  }
}

export const computerService = new ComputerService();
