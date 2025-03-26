import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { positionController } from '@/modules/position/controllers';
import { Role } from '@/modules/user/enums';

export const positionRouter = Router();

positionRouter.get(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER, Role.GUEST]),
  positionController.findAll,
);
positionRouter.get(
  '/deleted',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  positionController.findAllDeleted,
);
positionRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER, Role.GUEST]),
  positionController.findOneById,
);
positionRouter.post(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  positionController.createPosition,
);
positionRouter.patch(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  positionController.updatePosition,
);
positionRouter.delete(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  positionController.softDeletePosition,
);
positionRouter.patch(
  '/restore/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  positionController.restorePosition,
);
