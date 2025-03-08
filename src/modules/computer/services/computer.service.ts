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
      );

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
    const isComputerExisted = await ComputerModel.exists({
      name: createComputerDto.name,
    }).exec();
    // Ktra trung Position

    // Kiem tra Provider

    // Kiem tra PeripheralInfo

    if (isComputerExisted) {
      throw new ConflictException(
        `A computer with name '${createComputerDto.name}' has already existed.`,
      );
    }
    const newComputer = new ComputerModel(createComputerDto);

    return {
      data: computerDto.parse(await newComputer.save()),
    };
  }

  async updateComputer(
    id: string,
    updateUserDto: UpdateComputerDto,
  ): Promise<SuccessResponseBody<ComputerDto>> {
    // Ktra trung Position

    // Kiem tra Provider

    // Kiem tra PeripheralInfo
    const updatedComputer = await ComputerModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateUserDto,
      {
        new: true,
      },
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
