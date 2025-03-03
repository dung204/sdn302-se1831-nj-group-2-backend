import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { branchRouter } from '@/modules/branch/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/branches', branchRouter);
