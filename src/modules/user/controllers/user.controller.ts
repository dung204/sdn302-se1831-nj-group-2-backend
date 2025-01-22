import { NextFunction, Request, Response } from 'express';

import { commonQueryDto } from '@/base/common/dtos';
import { HttpStatusCode } from '@/base/common/enums';
import { createUserDto } from '@/modules/user/dtos/create-user.dto';
import { updateUserDto } from '@/modules/user/dtos/update-user.dto';
import { userService } from '@/modules/user/services';

class UserController {
  /**
   * `[GET]` `/api/v1/users`
   *
   * Get all existing (non-deleted) users
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = commonQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await userService.findAllAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/users/deleted`
   *
   * Get all deleted users
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = commonQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await userService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/users/:id`
   *
   * Get an existing user by ID
   * @throws {NotFoundException} - if a user is not found by the provided ID
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await userService.findOneById(req.params.id!));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST]` `/api/v1/users`
   *
   * Create a new user
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createUserDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await userService.createUser(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/users/:id`
   *
   * Update a new user
   * @throws {NotFoundException} - if a user is not found by the provided ID
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateUserDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(await userService.updateUser(req.params.id!, dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE]` `/api/v1/users/:id`
   *
   * Soft delete an existing user
   * @throws {NotFoundException} - if a user is not found by the provided ID
   */
  async softDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.softDeleteUser(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/users/:id`
   *
   * Restore an existing soft-deleted user
   * @throws {NotFoundException} - if a user is not found or already restored
   */
  async restoreUser(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await userService.restoreUser(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
