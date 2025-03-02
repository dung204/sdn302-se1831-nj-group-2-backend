import { Router } from 'express';

import { serviceCategoryRouter } from '@/modules/serviceCategory/router';
import { serviceTableRouter } from '@/modules/serviceTable/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/serviceCategory', serviceCategoryRouter);
appRouter.use('/serviceTable', serviceTableRouter);
