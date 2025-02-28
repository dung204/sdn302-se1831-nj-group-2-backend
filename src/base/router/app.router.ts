import { Router } from 'express';

import { providerRouter } from '@/modules/provider/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/providers', providerRouter);
