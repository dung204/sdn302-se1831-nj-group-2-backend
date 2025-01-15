import { Router } from 'express';

import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
