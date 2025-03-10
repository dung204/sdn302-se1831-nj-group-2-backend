import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { computerController } from '@/modules/computer/controllers';
import { Role } from '@/modules/user/enums';

export const computerRouter = Router();

computerRouter.get(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.findAll,
);

computerRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.findAllDeleted,
);

computerRouter.get(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.findOneById,
);

computerRouter.post(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.createComputer,
);

computerRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.updateComputer,
);

computerRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.softDeleteComputer,
);

computerRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),

  computerController.restoreComputer,
);
