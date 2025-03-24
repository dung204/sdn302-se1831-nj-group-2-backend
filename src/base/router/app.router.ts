import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { billRouter } from '@/modules/bill/router';
import { branchRouter } from '@/modules/branch/router';
import { computerRouter } from '@/modules/computer/router';
import { meRouter } from '@/modules/me/router';
import { peripheralRouter } from '@/modules/peripheral/router';
import { positionRouter } from '@/modules/position/router';
import { providerRouter } from '@/modules/provider/router';
import { serviceCategoryRouter } from '@/modules/service-category/router';
import { serviceTableRouter } from '@/modules/service-table/router';
import { usageTrackingRouter } from '@/modules/usage-tracking/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/me', meRouter);
appRouter.use('/usage-tracking', usageTrackingRouter);
appRouter.use('/service-categories', serviceCategoryRouter);
appRouter.use('/services', serviceTableRouter);
appRouter.use('/branches', branchRouter);
appRouter.use('/providers', providerRouter);
appRouter.use('/positions', positionRouter);
appRouter.use('/computers', computerRouter);
appRouter.use('/peripherals', peripheralRouter);
appRouter.use('/bills', billRouter);
