import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';

import { positionQueryDto } from '../dtos';
import { createPositionDto } from '../dtos/create-position.dto';
import { positionService } from '../services/position.service';

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
  // async findAllDeleted(req: Request, res: Response, next: NextFunction) {}

  /**
   * [GET] /api/v1/positions/:id
   */
  //async findOneById(req: Request, res: Response, next: NextFunction) {}

  /**
   * [POST] /api/v1/api/v1/positions
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
  //async updatePosition(req: Request, res: Response, next: NextFunction) {}

  /**
   * [DELETE] /api/v1/positions/:id
   */
  //async softDeletePosition(req: Request, res: Response, next: NextFunction) {}

  /**
   * [PATCH] /api/v1/positions/restore/:id
   */
  //async restorePosition(req: Request, res: Response, next: NextFunction) {}
}

export const positionController = new PositionController();
