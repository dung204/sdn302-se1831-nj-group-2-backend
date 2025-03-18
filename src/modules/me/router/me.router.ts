import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { meController } from '@/modules/me/controllers';

export const meRouter = Router();

meRouter.get('/profile', AuthGuard(), meController.getCurrentUserProfile);

meRouter.patch('/profile', AuthGuard(), meController.updateCurrentUserProfile);

meRouter.patch('/password', AuthGuard(), meController.changePassword);
