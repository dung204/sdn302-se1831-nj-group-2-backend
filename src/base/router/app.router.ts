import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { providerRouter } from '@/modules/provider/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/providers', providerRouter);
