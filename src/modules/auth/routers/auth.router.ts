import { Router } from 'express';

import { authController } from '@/modules/auth/controllers';

export const authRouter = Router();

authRouter.post('/login', authController.login);

authRouter.post('/refresh-token', authController.refreshToken);

authRouter.delete('/logout', authController.logout);

authRouter.post('/change-password', authController.changePassword);
