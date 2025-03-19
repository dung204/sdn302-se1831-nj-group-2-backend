import { Router } from 'express';

import { billController } from '@/modules/bill/controllers';

export const billRouter = Router();

billRouter.get('/', billController.findAll);
billRouter.get('/deleted', billController.findAllDeleted);
billRouter.get('/:id', billController.findOneById);
billRouter.post('/', billController.createBill);
billRouter.patch('/:id', billController.updateBill);
billRouter.delete('/:id', billController.softDeleteBill);
billRouter.patch('/restore/:id', billController.restoreBill);
