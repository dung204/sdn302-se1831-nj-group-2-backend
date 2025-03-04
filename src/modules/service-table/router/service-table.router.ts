import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { serviceTableController } from '@/modules/service-table//controllers/service-table.controller';
import { Role } from '@/modules/user/enums';

export const serviceTableRouter = Router();

serviceTableRouter.get(
  '/',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.findAll,
);

serviceTableRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.findAllDeleted,
);

serviceTableRouter.get(
  '/:id',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.findOneById,
);

serviceTableRouter.post(
  '/',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.createServiceTable,
);

serviceTableRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.updateServiceTable,
);

serviceTableRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.softDeleteServiceController,
);

serviceTableRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER, Role.ADMIN, Role.STAFF]),
  serviceTableController.restoreServiceController,
);
