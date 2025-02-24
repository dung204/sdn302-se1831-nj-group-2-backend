import { Router } from 'express';

import { authController } from '@/modules/auth/controllers';
import { AuthGuard } from '@/modules/auth/guards';

export const authRouter = Router();

authRouter.post('/login', authController.login);

authRouter.post('/refresh-token', authController.refreshToken);

authRouter.delete('/logout', authController.logout);

authRouter.patch(
  '/change-password',
  AuthGuard(),
  authController.changePassword,
);
