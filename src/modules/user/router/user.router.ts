import { Router } from 'express';

import { userController } from '@/modules/user/controllers';

export const userRouter = Router();

userRouter.get('/', userController.findAll);

userRouter.get('/deleted', userController.findAllDeleted);

userRouter.get('/:id', userController.findOneById);

userRouter.post('/', userController.createUser);

userRouter.patch('/:id', userController.updateUser);

userRouter.delete('/:id', userController.softDeleteUser);

userRouter.patch('/restore/:id', userController.restoreUser);
