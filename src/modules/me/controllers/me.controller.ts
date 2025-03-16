import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import { changePasswordDto } from '@/modules/auth/dtos';
import { authService } from '@/modules/auth/services';
import { updateUserDto, userDto } from '@/modules/user/dtos';
import { userService } from '@/modules/user/services';

class MeController {
  /**
   * `[POST] /api/v1/me/profile`
   */
  async getCurrentUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = req.user!;
      res.status(HttpStatusCode.OK).json({
        data: userDto.parse(await userService.findOneById(currentUser.id)),
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH] /api/v1/me/profile`
   */
  async updateCurrentUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const currentUser = req.user!;
      const dto = updateUserDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(await userService.updateUser(currentUser.id, dto, currentUser));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST] /api/v1/me/password`
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = changePasswordDto.parse(req.body);
      await authService.changePassword(req.user!, dto);
      res.status(HttpStatusCode.NO_CONTENT).end();
    } catch (err) {
      next(err);
    }
  }
}

export const meController = new MeController();
