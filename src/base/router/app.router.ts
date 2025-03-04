import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { serviceCategoryRouter } from '@/modules/service-category/router';
import { serviceTableRouter } from '@/modules/service-table/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/service-category', serviceCategoryRouter);
appRouter.use('/services', serviceTableRouter);
