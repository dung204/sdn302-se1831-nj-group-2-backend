import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';

class AuthController {
  /**
   * `[POST] /api/v1/auth/login`
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatusCode.CREATED).json({ message: 'Login' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST] /api/v1/auth/refresh-token`
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatusCode.CREATED).json({ message: 'Refresh token' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE] /api/v1/auth/logout`
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatusCode.NO_CONTENT).json({ message: 'Logout' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST] /api/v1/auth/change-password`
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatusCode.OK).json({ message: 'Change password' });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
