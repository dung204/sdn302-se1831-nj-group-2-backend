import { Router } from 'express';

import { positionController } from '../controllers/position.controller';

export const positionRouter = Router();

positionRouter.get('/', positionController.findAll);
positionRouter.get('/:id', positionController.findOneById);
positionRouter.post('/', positionController.createPosition);
positionRouter.patch('/:id', positionController.updatePosition);
positionRouter.delete('/:id', positionController.softDeletePosition);
positionRouter.patch('restore/:id', positionController.restorePosition);
positionRouter.get('/deleted', positionController.findAllDeleted);
