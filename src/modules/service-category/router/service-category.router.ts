import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { serviceCategoryController } from '@/modules/service-category/controllers';
import { Role } from '@/modules/user/enums';

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.findAll,
);

serviceCategoryRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.findAllDeleted,
);

serviceCategoryRouter.get(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.findOneById,
);

serviceCategoryRouter.post(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.createServiceCategory,
);

serviceCategoryRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.updateServiceCategory,
);

serviceCategoryRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.softDeleteServiceController,
);

serviceCategoryRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  serviceCategoryController.restoreServiceController,
);
