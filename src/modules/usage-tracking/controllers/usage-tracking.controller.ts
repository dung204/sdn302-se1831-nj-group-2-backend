import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  createUsageTrackingDto,
  updateUsageTrackingDto,
  usageTrackingQueryDto,
} from '@/modules/usage-tracking/dtos';
import { usageTrackingService } from '@/modules/usage-tracking/services';

class UsageTrackingController {
  /**
   * `[GET]` `/api/v1/usage-tracking`
   * Get all existing (non-deleted) usage tracking records
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = usageTrackingQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await usageTrackingService.findAllAndCount({
          ...dto,
          deleted: false,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/usage-tracking/deleted`
   * Get all deleted usage tracking records
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = usageTrackingQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await usageTrackingService.findAllDeletedAndCount({
          ...dto,
          deleted: true,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/usage-tracking/:id`
   * Get an existing usage tracking record by ID
   * @throws {NotFoundException} - if a usage tracking record is not found by the provided ID
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json({ data: await usageTrackingService.findOneById(req.params.id!) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST]` `/api/v1/usage-tracking`
   * Create a new usage tracking record
   */
  async createUsageTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = await createUsageTrackingDto.parseAsync(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await usageTrackingService.createUsageTracking(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/usage-tracking/:id`
   * Update a usage tracking record
   * @throws {NotFoundException} - if a usage tracking record is not found by the provided ID
   */
  async updateUsageTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = await updateUsageTrackingDto.parseAsync(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await usageTrackingService.updateUsageTracking(req.params.id!, dto),
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE]` `/api/v1/usage-tracking/:id`
   * Soft delete an existing usage tracking record
   * @throws {NotFoundException} - if a usage tracking record is not found by the provided ID
   */
  async softDeleteUsageTracking(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await usageTrackingService.softDeleteUsageTracking(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/usage-tracking/:id/restore`
   * Restore an existing soft-deleted usage tracking record
   * @throws {NotFoundException} - if a usage tracking record is not found or already restored
   */
  async restoreUsageTracking(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await usageTrackingService.restoreUsageTracking(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const usageTrackingController = new UsageTrackingController();
