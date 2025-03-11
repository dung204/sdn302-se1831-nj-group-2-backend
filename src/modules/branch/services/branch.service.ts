import { RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { BranchQueryDto } from '@/modules/branch/dtos';
import {
  BranchDto,
  DeletedBranchDto,
  branchDto,
  deletedBranchDto,
} from '@/modules/branch/dtos/branch.dto';
import { CreateBranchDto } from '@/modules/branch/dtos/create-branch.dto';
import { UpdateBranchDto } from '@/modules/branch/dtos/update-branch.dto';
import { Branch, BranchModel } from '@/modules/branch/models';
import { ServiceTableModel } from '@/modules/service-table/models';

class BranchService {
  findAllAndCount(
    commonQueryDto: BranchQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<BranchDto[]>>;
  findAllAndCount(
    commonQueryDto: BranchQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedBranchDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    ...filter
  }: BranchQueryDto): Promise<
    SuccessResponseBody<BranchDto[] | DeletedBranchDto[]>
  > {
    const {
      name,
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
    } = filter;
    const queryFilter: RootFilterQuery<Branch> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...(name && { name: { $regex: name, $options: 'i' } }),
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    const query = BranchModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const branches = await query.exec();

    const total = await BranchModel.countDocuments(queryFilter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: branches.map((branch) =>
        deleted ? deletedBranchDto.parse(branch) : branchDto.parse(branch),
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

  async findAllDeletedAndCount(branchQueryDto: BranchQueryDto) {
    return this.findAllAndCount({ ...branchQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<SuccessResponseBody<BranchDto>> {
    const branch = await BranchModel.findOne({
      _id: id,
      deleteTimestamp: null,
    }).exec();

    if (!branch) {
      throw new NotFoundException('Branch not found.');
    }

    return {
      data: branchDto.parse(branch),
    };
  }

  async createBranch(
    createBranchDto: CreateBranchDto,
  ): Promise<SuccessResponseBody<BranchDto>> {
    const { services } = createBranchDto;

    for (const service of services) {
      const isServiceExisted = await ServiceTableModel.exists({
        _id: service,
        deleteTimestamp: null,
      }).exec();

      if (!isServiceExisted) {
        throw new NotFoundException(
          `Service with ID: '${service}' is not found.`,
        );
      }
    }

    const newBranch = await new BranchModel(createBranchDto).save();
    return {
      data: branchDto.parse(await newBranch.populate(['services'])),
    };
  }

  async updateBranch(
    id: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<SuccessResponseBody<BranchDto>> {
    const { services } = updateBranchDto;

    const updatedBranch = await BranchModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateBranchDto,
      {
        new: true,
      },
    );

    for (const service of services ?? []) {
      const isServiceExisted = await ServiceTableModel.exists({
        _id: service,
        deleteTimestamp: null,
      }).exec();

      if (!isServiceExisted) {
        throw new NotFoundException(
          `Service with ID: '${service}' is not found.`,
        );
      }
    }

    if (!updatedBranch) {
      throw new NotFoundException('Branch not found.');
    }

    return {
      data: branchDto.parse(updatedBranch),
    };
  }

  async softDeleteBranch(id: string) {
    const updateResult = await BranchModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'Branch not found or has been already deleted.',
      );
    }
  }

  async restoreBranch(id: string): Promise<SuccessResponseBody<BranchDto>> {
    const updatedBranch = await BranchModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedBranch) {
      throw new NotFoundException(
        'Branch not found or has been already restored.',
      );
    }

    return {
      data: branchDto.parse(updatedBranch),
    };
  }
}

export const branchService = new BranchService();
