import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { userController } from '@/modules/user/controllers';

import { Role } from '../enums';

export const userRouter = Router();

userRouter.get(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  userController.findAll,
);

userRouter.get(
  '/deleted',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  userController.findAllDeleted,
);

userRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  userController.findOneById,
);

userRouter.post(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  userController.createUser,
);

userRouter.patch(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  userController.updateUser,
);

userRouter.delete(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  userController.softDeleteUser,
);

userRouter.patch(
  '/restore/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  userController.restoreUser,
);
