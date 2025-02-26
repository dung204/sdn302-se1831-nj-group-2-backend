import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
