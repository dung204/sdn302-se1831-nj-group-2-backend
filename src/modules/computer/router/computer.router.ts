import { Router } from 'express';

import { computerController } from '@/modules/computer/controllers';

export const computerRouter = Router();

computerRouter.get(
  '/',

  computerController.findAll,
);

computerRouter.get(
  '/deleted',

  computerController.findAllDeleted,
);

computerRouter.get(
  '/:id',

  computerController.findOneById,
);

computerRouter.post(
  '/',

  computerController.createComputer,
);

computerRouter.patch(
  '/:id',

  computerController.updateComputer,
);

computerRouter.delete(
  '/:id',

  computerController.softDeleteComputer,
);

computerRouter.patch(
  '/restore/:id',

  computerController.restoreComputer,
);
