import { Router } from 'express';

import { usageTrackingController } from '@/modules/usage-tracking/controllers';

export const usageTrackingRouter = Router();

// Get all non-deleted usage tracking records
usageTrackingRouter.get('/', usageTrackingController.findAll);

// Get all deleted usage tracking records
usageTrackingRouter.get('/deleted', usageTrackingController.findAllDeleted);

// Get a specific usage tracking record by ID
usageTrackingRouter.get('/:id', usageTrackingController.findOneById);

// Create a new usage tracking record
usageTrackingRouter.post('/', usageTrackingController.createUsageTracking);

// Update an existing usage tracking record
usageTrackingRouter.patch('/:id', usageTrackingController.updateUsageTracking);

// Soft delete a usage tracking record
usageTrackingRouter.delete(
  '/:id',
  usageTrackingController.softDeleteUsageTracking,
);

// Restore a soft-deleted usage tracking record
usageTrackingRouter.patch(
  '/restore/:id',
  usageTrackingController.restoreUsageTracking,
);
