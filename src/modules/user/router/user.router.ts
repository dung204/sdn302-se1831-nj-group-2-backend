import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { userController } from '@/modules/user/controllers';

import { Role } from '../enums';

export const userRouter = Router();

userRouter.get(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.findAll,
);

userRouter.get(
  '/deleted',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.findAllDeleted,
);

userRouter.get(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.findOneById,
);

userRouter.post(
  '/',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.createUser,
);

userRouter.patch(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.updateUser,
);

userRouter.delete(
  '/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.softDeleteUser,
);

userRouter.patch(
  '/restore/:id',
  AuthGuard([Role.OWNER, Role.BRANCH_ADMIN, Role.STAFF]),
  userController.restoreUser,
);
