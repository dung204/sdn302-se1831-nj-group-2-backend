import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  changePasswordDto,
  loginRequestDto,
  refreshRequestDto,
} from '@/modules/auth/dtos';
import { authService } from '@/modules/auth/services';

class AuthController {
  /**
   * `[POST] /api/v1/auth/login`
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginRequestDto.parse(req.body);
      res.status(HttpStatusCode.CREATED).json(await authService.login(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST] /api/v1/auth/refresh-token`
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshRequestDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await authService.refresh(refreshToken));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE] /api/v1/auth/logout`
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!, req.accessToken!);
      res.status(HttpStatusCode.NO_CONTENT).end();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST] /api/v1/auth/change-password`
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

export const authController = new AuthController();
