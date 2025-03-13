import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { peripheralInfoController } from '@/modules/peripheral-info/controllers';
import { Role } from '@/modules/user/enums/role.enum';

export const peripheralInfoRouter = Router();

peripheralInfoRouter.get(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  peripheralInfoController.findAll,
);

peripheralInfoRouter.get(
  '/deleted',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralInfoController.findAllDeleted,
);

peripheralInfoRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  peripheralInfoController.findOneById,
);

peripheralInfoRouter.post(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralInfoController.createPeripheralInfo,
);

peripheralInfoRouter.patch(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralInfoController.updatePeripheralInfo,
);

peripheralInfoRouter.delete(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralInfoController.softDeletePeripheralInfo,
);

peripheralInfoRouter.patch(
  '/restore/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  peripheralInfoController.restorePeripheralInfo,
);
