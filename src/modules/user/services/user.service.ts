import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import {
  ConflictException,
  ForbiddenException,
} from '@/base/common/exceptions';
import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { Logger, envVariables } from '@/base/common/utils';
import { PasswordUtils } from '@/modules/auth/utils';
import { UserQueryDto } from '@/modules/user/dtos';
import { CreateUserDto } from '@/modules/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dtos/update-user.dto';
import {
  DeletedUserDto,
  UserDto,
  deletedUserDto,
  userDto,
} from '@/modules/user/dtos/user.dto';
import { Role } from '@/modules/user/enums';
import { User, UserModel } from '@/modules/user/models';

class UserService {
  private readonly logger = new Logger(UserService.name);

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
    ...filter
  }: UserQueryDto): Promise<SuccessResponseBody<UserDto[] | DeletedUserDto[]>> {
    const {
      fromCreateTimestamp,
      fromDeleteTimestamp,
      toCreateTimestamp,
      toDeleteTimestamp,
    } = filter;

    const queryFilter: RootFilterQuery<User> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
    };

    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    const query = UserModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const users = await query.exec();
    const total = await UserModel.countDocuments(queryFilter).exec();
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
        filter,
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
    currentUser: User,
  ): Promise<SuccessResponseBody<UserDto>> {
    if (!this.canMutateUserOfRole(currentUser, createUserDto.role)) {
      throw new ForbiddenException();
    }

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
    currentUser: User,
  ): Promise<SuccessResponseBody<UserDto>> {
    const roleToMutate = !updateUserDto.role
      ? (await this.findOneById(id)).role
      : updateUserDto.role;

    if (!this.canMutateUserOfRole(currentUser, roleToMutate)) {
      throw new ForbiddenException();
    }

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

  async softDeleteUser(id: string, currentUser: User) {
    const roleToMutate = (await this.findOneById(id)).role;

    if (!this.canMutateUserOfRole(currentUser, roleToMutate)) {
      throw new ForbiddenException();
    }

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

  async restoreUser(
    id: string,
    currentUser: User,
  ): Promise<SuccessResponseBody<UserDto>> {
    const roleToMutate = (await this.findOneById(id)).role;

    if (!this.canMutateUserOfRole(currentUser, roleToMutate)) {
      throw new ForbiddenException();
    }

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

  async insertInitialOwner() {
    try {
      this.logger.info('Inserting initial OWNER...');

      const initialOwnerInfo = {
        username: envVariables.INITIAL_OWNER_USERNAME,
        role: Role.OWNER,
      };
      const initialOwnerIsExisted = await UserModel.exists(initialOwnerInfo);

      if (initialOwnerIsExisted) {
        this.logger.info(
          'Initial OWNER is already existed, inserting will be skipped.',
        );
        return;
      }

      await new UserModel({
        ...initialOwnerInfo,
        password: await PasswordUtils.hashPassword(
          envVariables.INITIAL_OWNER_PASSWORD,
        ),
        firstName: 'Initial',
        lastName: 'Owner',
      }).save();

      this.logger.info('Insert initial OWNER to database successfully!');
    } catch (err) {
      this.logger.fatal(err);
    }
  }

  // Mutation includes: add, update, delete
  private canMutateUserOfRole(currentUser: User, roleToMutate: Role) {
    switch (currentUser.role) {
      case Role.OWNER:
        return true;
      case Role.BRANCH_ADMIN:
        return [Role.STAFF, Role.GUEST].includes(roleToMutate);
      case Role.STAFF:
        return roleToMutate === Role.GUEST;
      case Role.GUEST:
        return false;
    }
  }
}

export const userService = new UserService();
