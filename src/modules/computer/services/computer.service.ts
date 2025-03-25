import { RootFilterQuery, SortOrder } from 'mongoose';

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
import { PeripheralModel } from '@/modules/peripheral/models';
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
    ...filter
  }: ComputerQueryDto): Promise<
    SuccessResponseBody<ComputerDto[] | DeletedComputerDto[]>
  > {
    const {
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
      fromPricePerHour,
      toPricePerHour,
      name,
      status,
      branch,
      ...otherFilters
    } = filter;
    const queryFilter: RootFilterQuery<Computer> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(status && { status: { $in: status } }),
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(branch && { position: { branch } }),
      ...otherFilters,
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    if (fromPricePerHour || toPricePerHour) {
      queryFilter.pricePerHour = {
        ...(fromPricePerHour && { $gte: fromPricePerHour }),
        ...(toPricePerHour && { $lte: toPricePerHour }),
      };
    }

    const query = ComputerModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      )
      .populate('position')
      .populate('provider');

    const computers = await query.exec();
    const total = await ComputerModel.countDocuments(queryFilter).exec();
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
        filter,
      },
    };
  }

  async findAllDeletedAndCount(userQueryDto: ComputerQueryDto) {
    return this.findAllAndCount({ ...userQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<SuccessResponseBody<ComputerDto>> {
    const computer = await ComputerModel.findOne({
      _id: id,
      deleteTimestamp: null,
    }).populate(['position', 'provider']);

    if (!computer) {
      throw new NotFoundException('Computer not found.');
    }

    return {
      data: computerDto.parse(computer),
    };
  }

  async createComputer(
    createComputerDto: CreateComputerDto,
  ): Promise<SuccessResponseBody<ComputerDto>> {
    const { name, position, provider, peripherals } = createComputerDto;

    // Check if the computer already exists
    const isComputerExisted = await ComputerModel.exists({ name }).exec();

    if (isComputerExisted) {
      throw new ConflictException(
        `A computer with name '${name}' already exists.`,
      );
    }

    // Check if the position exists
    const positionDoc = await PositionModel.findById(position).exec();
    if (!positionDoc) {
      throw new NotFoundException(`Position not found.`);
    }

    // Check if the position is already assigned to another computer
    const isPositionTaken = await ComputerModel.exists({
      position,
    }).exec();
    if (isPositionTaken) {
      throw new ConflictException(
        `Position '${positionDoc.name}' is already assigned to another computer.`,
      );
    }

    // Check if the provider exists
    const isProviderExisted = await ProviderModel.exists({
      _id: provider,
    }).exec();
    if (!isProviderExisted) {
      throw new NotFoundException(`Provider not found.`);
    }

    for (const peripheral of peripherals) {
      const isPeripheralExisted = await PeripheralModel.exists({
        _id: peripheral,
        deleteTimestamp: null,
      });
      if (!isPeripheralExisted) {
        throw new NotFoundException(
          `Peripheral with id '${peripheral}' is not found.`,
        );
      }
    }

    // Create the new computer
    const newComputer = await (
      await new ComputerModel({
        ...createComputerDto,
        peripherals: peripherals.map((peripheral) => ({
          _id: peripheral,
        })),
      }).save()
    ).populate(['position', 'provider', 'peripherals._id']);

    return {
      data: computerDto.parse(newComputer),
    };
  }

  async updateComputer(
    id: string,
    updateComputerDto: UpdateComputerDto,
  ): Promise<SuccessResponseBody<ComputerDto>> {
    const { position, provider, peripherals } = updateComputerDto;
    // Check if the computer exists
    const existingComputer = await ComputerModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!existingComputer) {
      throw new NotFoundException('Computer not found.');
    }

    // Check if the position exists (UUID check)
    if (position) {
      const isPositionExisted = await PositionModel.exists({
        _id: position,
      }).exec();
      if (!isPositionExisted) {
        throw new NotFoundException(
          `Position with id '${position}' not found.`,
        );
      }
    }

    if (provider) {
      const isProviderExisted = await ProviderModel.exists({
        _id: provider,
      }).exec();
      if (!isProviderExisted) {
        throw new NotFoundException(
          `Provider with id '${provider}' not found.`,
        );
      }
    }

    for (const peripheral of peripherals ?? []) {
      const isPeripheralExisted = await PeripheralModel.exists({
        _id: peripheral,
        deleteTimestamp: null,
      });
      if (!isPeripheralExisted) {
        throw new NotFoundException(
          `Peripheral with id '${peripheral}' is not found.`,
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
