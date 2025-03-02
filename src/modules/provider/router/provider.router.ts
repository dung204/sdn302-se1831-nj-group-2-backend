import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { Role } from '@/modules/user/enums';

import { providerController } from '../controller/provider.controller';

export const providerRouter = Router();

providerRouter.get(
  '/',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  providerController.findAll,
);
providerRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER]),
  providerController.findAllDeleted,
);
providerRouter.get(
  '/:id',
  AuthGuard([Role.OWNER]),
  providerController.findOneById,
);
providerRouter.post(
  '/',
  AuthGuard([Role.OWNER]),
  providerController.createProvider,
);
providerRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER]),
  providerController.updateProvider,
);
providerRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER]),
  providerController.softDeleteProvider,
);
providerRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER]),
  providerController.restoreProvider,
);
