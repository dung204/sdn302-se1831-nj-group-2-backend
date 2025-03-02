import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  createPositionDto,
  positionQueryDto,
  updatePositionDto,
} from '@/modules/position/dtos';
import { positionService } from '@/modules/position/services';

class PositionController {
  /**
   * [GET] /api/v1/positions
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = positionQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(
          await positionService.findAllAndCount({ ...dto, deleted: false }),
        );
    } catch (err) {
      next(err);
    }
  }
  /**
   * [GET] /api/v1/branch/:branchId/positions
   */
  //async findAllByBranchId(req: Request, res: Response, next: NextFunction) {}

  /**
   * [GET] /api/v1/positions/deleted
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = positionQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await positionService.findAllAndCount({ ...dto, deleted: true }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [GET] /api/v1/positions/:id
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json({ data: await positionService.findOneById(req.params.id!) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * [POST] /api/v1/positions
   */
  async createPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const newPosition = createPositionDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await positionService.createPosition(newPosition));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [PATCH] /api/v1/positions/:id
   */
  async updatePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPosition = updatePositionDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await positionService.updatePosition(req.params.id!, updatedPosition),
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * [DELETE] /api/v1/positions/:id
   *
   * Soft delete a position
   * @throws {NotFoundException} - if a position is not found by the provided ID
   */
  async softDeletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      await positionService.softDeletePosition(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * [PATCH] /api/v1/positions/restore/:id
   *
   * Restore a soft deleted position
   * @throws {NotFoundException} - if a position is not found by the provided ID
   */
  async restorePosition(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await positionService.restorePosition(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const positionController = new PositionController();
