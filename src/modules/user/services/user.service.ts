import { RootFilterQuery } from 'mongoose';

import { CommonQueryDto } from '@/base/common/dtos';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';
import {
  DeletedUserDto,
  UserDto,
  deletedUserDto,
  userDto,
} from '@/modules/user/dtos/user.dto';
import { User, UserModel } from '@/modules/user/models';

class UserService {
  findAllAndCount(
    commonQueryDto: CommonQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<UserDto[]>>;
  findAllAndCount(
    commonQueryDto: CommonQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedUserDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    deleted = false,
  }: CommonQueryDto): Promise<
    SuccessResponseBody<UserDto[] | DeletedUserDto[]>
  > {
    const filter: RootFilterQuery<User> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = UserModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const users = await query.exec();

    const total = await UserModel.countDocuments(filter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: users.map((user) =>
        deleted ? deletedUserDto.parse(user) : userDto.parse(user),
      ),
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          hasPreviousPage: page < totalPage,
          hasNextPage: page > 1,
        },
      },
    };
  }

  async findAllDeletedAndCount(commonQueryDto: CommonQueryDto) {
    return this.findAllAndCount({ ...commonQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<SuccessResponseBody<UserDto>> {
    const user = await UserModel.findOne({ _id: id, deleteTimestamp: null });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      data: userDto.parse(user),
    };
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<SuccessResponseBody<UserDto>> {
    const newUser = new UserModel(createUserDto);
    return {
      data: userDto.parse(await newUser.save()),
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponseBody<UserDto>> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: null },
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    return {
      data: userDto.parse(updatedUser),
    };
  }

  async softDeleteUser(id: string) {
    const updateResult = await UserModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount !== 1) {
      throw new NotFoundException(
        'User not found or has been already deleted.',
      );
    }
  }

  async restoreUser(id: string): Promise<SuccessResponseBody<UserDto>> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
    );

    if (!updatedUser) {
      throw new NotFoundException(
        'User not found or has been already restored.',
      );
    }

    return {
      data: userDto.parse(updatedUser),
    };
  }
}

export const userService = new UserService();
