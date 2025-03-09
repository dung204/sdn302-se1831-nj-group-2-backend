import { Router } from 'express';

import { authRouter } from '@/modules/auth/routers';
import { providerRouter } from '@/modules/provider/router';
import { usageTrackingRouter } from '@/modules/usage-tracking/router';
import { userRouter } from '@/modules/user/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
appRouter.use('/usage-tracking', usageTrackingRouter);
appRouter.use('/provider', providerRouter);
