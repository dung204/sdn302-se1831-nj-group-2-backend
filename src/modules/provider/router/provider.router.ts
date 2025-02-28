import { Router } from 'express';

import { providerController } from '../controller/provider.controller';

export const providerRouter = Router();

providerRouter.get('/', providerController.findAll);
providerRouter.get('/deleted', providerController.findAllDeleted);
providerRouter.get('/:id', providerController.findOneById);
providerRouter.post('/', providerController.createProvider);
providerRouter.patch('/:id', providerController.updateProvider);
providerRouter.delete('/:id', providerController.softDeleteProvider);
providerRouter.patch('/restore/:id', providerController.restoreProvider);
