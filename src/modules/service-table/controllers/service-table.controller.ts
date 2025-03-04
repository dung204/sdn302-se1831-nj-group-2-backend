import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  createServiceTableDto,
  serviceTableQueryDto,
  updateServiceTableDto,
} from '@/modules/service-table/dtos';
import { serviceTableService } from '@/modules/service-table/services';

class ServiceTableController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = serviceTableQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(
          await serviceTableService.findAllAndCount({ ...dto, deleted: false }),
        );
    } catch (err) {
      next(err);
    }
  }
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = serviceTableQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(
          await serviceTableService.findAllAndCount({ ...dto, deleted: true }),
        );
    } catch (error) {
      next(error);
    }
  }

  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await serviceTableService.findOneById(req.params.id!));
    } catch (error) {
      next(error);
    }
  }

  async createServiceTable(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createServiceTableDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await serviceTableService.createServiceTable(dto));
    } catch (err) {
      next(err);
    }
  }
  async updateServiceTable(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateServiceTableDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await serviceTableService.updateServiceTable(req.params.id!, dto),
        );
    } catch (err) {
      next(err);
    }
  }
  async softDeleteServiceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await serviceTableService.softDeleteServiceTable(req.params.id!);
      res.status(HttpStatusCode.OK).json({ message: 'Delete successfully' });
    } catch (err) {
      next(err);
    }
  }
  async restoreServiceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await serviceTableService.restoreServiceTable(req.params.id!);
      res.status(HttpStatusCode.OK).json({ message: 'Restore successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceTableController = new ServiceTableController();
