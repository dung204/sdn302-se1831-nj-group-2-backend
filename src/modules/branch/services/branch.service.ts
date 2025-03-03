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
// import { UpdateBranchDto } from '@/modules/branch/dtos/update-branch.dto';
import { Branch, BranchModel } from '@/modules/branch/models';

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
  }: BranchQueryDto): Promise<
    SuccessResponseBody<BranchDto[] | DeletedBranchDto[]>
  > {
    const filter: RootFilterQuery<Branch> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = BranchModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const branches = await query.exec();

    const total = await BranchModel.countDocuments(filter).exec();
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
    });

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
    const newBranch = new BranchModel(createBranchDto);
    return {
      data: branchDto.parse(await newBranch.save()),
    };
  }

  async updateBranch(
    id: string,
    updateData: {
      name?: string;
      address?: string | null;
      admin?: string;
      services?: string[];
    },
  ): Promise<SuccessResponseBody<BranchDto>> {
    const updatedBranch = await BranchModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateData,
      {
        new: true,
      },
    );

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
