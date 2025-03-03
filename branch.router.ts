import { Router } from 'express';

import { branchController } from '@/modules/branch/controllers';

export const branchRouter = Router();

branchRouter.get('/', branchController.findAll);

branchRouter.get('/deleted', branchController.findAllDeleted);

branchRouter.get('/:id', branchController.findOneById);

branchRouter.post('/', branchController.createBranch);

branchRouter.patch('/:id', branchController.updateBranch);

branchRouter.delete('/:id', branchController.softDeleteBranch);

branchRouter.patch('/restore/:id', branchController.restoreBranch);
