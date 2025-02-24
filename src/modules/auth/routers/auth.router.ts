import { Router } from 'express';

import { authController } from '@/modules/auth/controllers';
import { AuthGuard } from '@/modules/auth/guards';

export const authRouter = Router();

authRouter.post('/login', authController.login);

authRouter.post('/refresh-token', authController.refresh);

authRouter.delete('/logout', AuthGuard(), authController.logout);

authRouter.patch(
  '/change-password',
  AuthGuard(),
  authController.changePassword,
);

authRouter.get('/private', AuthGuard(), (req, res) => {
  res.json({ message: 'OK' });
});
