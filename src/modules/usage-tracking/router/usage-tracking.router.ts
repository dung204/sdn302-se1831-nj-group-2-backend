import { Router } from 'express';

import { AuthGuard } from '@/modules/auth/guards';
import { usageTrackingController } from '@/modules/usage-tracking/controllers';
import { Role } from '@/modules/user/enums';

export const usageTrackingRouter = Router();

// Get all non-deleted usage tracking records
usageTrackingRouter.get(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  usageTrackingController.findAll,
);

// Get all deleted usage tracking records
usageTrackingRouter.get(
  '/deleted',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  usageTrackingController.findAllDeleted,
);

// Get a specific usage tracking record by ID
usageTrackingRouter.get(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  usageTrackingController.findOneById,
);

// Create a new usage tracking record
usageTrackingRouter.post(
  '/',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER, Role.STAFF]),
  usageTrackingController.createUsageTracking,
);

// Update an existing usage tracking record
usageTrackingRouter.patch(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  usageTrackingController.updateUsageTracking,
);

// Soft delete a usage tracking record
usageTrackingRouter.delete(
  '/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  usageTrackingController.softDeleteUsageTracking,
);

// Restore a soft-deleted usage tracking record
usageTrackingRouter.patch(
  '/restore/:id',
  AuthGuard([Role.BRANCH_ADMIN, Role.OWNER]),
  usageTrackingController.restoreUsageTracking,
);
