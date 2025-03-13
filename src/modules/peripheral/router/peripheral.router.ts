import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { peripheralController } from '@/modules/peripheral/controllers';
import { Role } from '@/modules/user/enums/role.enum';

export const peripheralRouter = Router();

peripheralRouter.get(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  peripheralController.findAll,
);

peripheralRouter.get(
  '/deleted',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralController.findAllDeleted,
);

peripheralRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  peripheralController.findOneById,
);

peripheralRouter.post(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralController.createPeripheralInfo,
);

peripheralRouter.patch(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralController.updatePeripheralInfo,
);

peripheralRouter.delete(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralController.softDeletePeripheralInfo,
);

peripheralRouter.patch(
  '/restore/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralController.restorePeripheralInfo,
);
