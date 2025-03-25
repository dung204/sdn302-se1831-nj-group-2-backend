import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { branchController } from '@/modules/branch/controllers';
import { Role } from '@/modules/user/enums/role.enum';

export const branchRouter = Router();

branchRouter.get('/', AuthGuard(), branchController.findAll);

branchRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER]),
  branchController.findAllDeleted,
);

branchRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.STAFF, Role.OWNER]),
  branchController.findOneById,
);

branchRouter.post('/', AuthGuard([Role.OWNER]), branchController.createBranch);

branchRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER]),
  branchController.updateBranch,
);

branchRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER]),
  branchController.softDeleteBranch,
);

branchRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER]),
  branchController.restoreBranch,
);
