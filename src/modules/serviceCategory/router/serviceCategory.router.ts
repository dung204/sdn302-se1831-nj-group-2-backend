import { Router } from 'express';

import { serviceCategoryController } from './../controllers/serviceCategory.controller';

export const serviceCategoryRouter = Router();

serviceCategoryRouter.get('/', serviceCategoryController.findAll);

serviceCategoryRouter.get('/deleted', serviceCategoryController.findAllDeleted);

serviceCategoryRouter.get('/:id', serviceCategoryController.findOneById);

serviceCategoryRouter.post(
  '/',
  serviceCategoryController.createServiceCategory,
);

serviceCategoryRouter.patch(
  '/:id',
  serviceCategoryController.updateServiceCategory,
);

serviceCategoryRouter.delete(
  '/:id',
  serviceCategoryController.softDeleteServiceController,
);

serviceCategoryRouter.patch(
  '/restore/:id',
  serviceCategoryController.restoreServiceController,
);
