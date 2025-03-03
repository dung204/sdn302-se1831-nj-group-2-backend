import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { ConflictException } from '@/base/common/exceptions';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { redis } from '@/base/redis';
import { authService } from '@/modules/auth/services';
import { UserQueryDto } from '@/modules/user/dtos';
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
    commonQueryDto: UserQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<UserDto[]>>;
  findAllAndCount(
    commonQueryDto: UserQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedUserDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
  }: UserQueryDto): Promise<SuccessResponseBody<UserDto[] | DeletedUserDto[]>> {
    const filter: RootFilterQuery<User> = {
      deleteTimestamp: deleted ? { $ne: null } : null,
    };

    const query = UserModel.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

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
          totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage,
        },
        sorting,
      },
    };
  }

  async findAllDeletedAndCount(userQueryDto: UserQueryDto) {
    return this.findAllAndCount({ ...userQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({ _id: id, deleteTimestamp: null });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({ username, deleteTimestamp: null });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<SuccessResponseBody<UserDto>> {
    const isUserExisted = await UserModel.exists({
      username: createUserDto.username,
    }).exec();

    if (isUserExisted) {
      throw new ConflictException(
        `A user with username '${createUserDto.username}' has already existed.`,
      );
    }

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

  async softDeleteUser(id: string, userId: string) {
    // Check your own account
    if (id === userId) {
      throw new ConflictException(
        'You can not delete your own account. Please contact the administrator.',
      );
    }

    const updateResult = await UserModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );

    if (updateResult.modifiedCount === 0) {
      throw new NotFoundException(
        'User not found or has been already deleted.',
      );
    }

    // Check if refresh token exists in Redis -> delete and get it
    const refreshTokenExists = await redis.getInstance().getdel(id);
    // If refresh token exists, relocate it from blacklist
    if (refreshTokenExists) {
      await authService.blacklistToken(refreshTokenExists);
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
