import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { positionController } from '@/modules/position/controllers';
import { Role } from '@/modules/user/enums';

export const positionRouter = Router();

positionRouter.get(
  '/',
  AuthGuard([Role.ADMIN, Role.STAFF, Role.OWNER]),
  positionController.findAll,
);
positionRouter.get(
  '/deleted',
  AuthGuard([Role.ADMIN, Role.OWNER]),
  positionController.findAllDeleted,
);
positionRouter.get(
  '/:id',
  AuthGuard([Role.ADMIN, Role.STAFF, Role.OWNER]),
  positionController.findOneById,
);
positionRouter.post(
  '/',
  AuthGuard([Role.ADMIN, Role.OWNER]),
  positionController.createPosition,
);
positionRouter.patch(
  '/:id',
  AuthGuard([Role.ADMIN, Role.OWNER]),
  positionController.updatePosition,
);
positionRouter.delete(
  '/:id',
  AuthGuard([Role.ADMIN, Role.STAFF, Role.OWNER]),
  positionController.softDeletePosition,
);
positionRouter.patch(
  '/restore/:id',
  AuthGuard([Role.ADMIN, Role.OWNER]),
  positionController.restorePosition,
);
