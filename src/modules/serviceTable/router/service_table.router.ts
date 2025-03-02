import { Router } from 'express';

import { serviceTableController } from '../controllers/service_table.controller';

export const serviceTableRouter = Router();

serviceTableRouter.get('/', serviceTableController.findAll);

serviceTableRouter.get('/deleted', serviceTableController.findAllDeleted);

serviceTableRouter.get('/:id', serviceTableController.findOneById);

serviceTableRouter.post('/', serviceTableController.createServiceTable);

serviceTableRouter.patch('/:id', serviceTableController.updateServiceTable);

serviceTableRouter.delete(
  '/:id',
  serviceTableController.softDeleteServiceController,
);

serviceTableRouter.patch(
  '/restore/:id',
  serviceTableController.restoreServiceController,
);
