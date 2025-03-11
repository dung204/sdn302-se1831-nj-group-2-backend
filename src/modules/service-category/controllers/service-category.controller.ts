import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  createServiceCategoryDto,
  serviceCategoryQueryDto,
  updateServiceCategoryDto,
} from '@/modules/service-category/dtos';
import { serviceCategoryService } from '@/modules/service-category/services';

class ServiceCategoryController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = serviceCategoryQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await serviceCategoryService.findAllAndCount({
          ...dto,
          deleted: false,
        }),
      );
    } catch (err) {
      next(err);
    }
  }
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = serviceCategoryQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await serviceCategoryService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await serviceCategoryService.findOneById(req.params.id!));
    } catch (err) {
      next(err);
    }
  }

  async createServiceCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createServiceCategoryDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await serviceCategoryService.createServiceCategory(dto));
    } catch (err) {
      next(err);
    }
  }
  async updateServiceCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateServiceCategoryDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await serviceCategoryService.updateServiceCategory(
            req.params.id!,
            dto,
          ),
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
      await serviceCategoryService.softDeleteServiceCategory(req.params.id!);
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
      res
        .status(HttpStatusCode.OK)
        .json(
          await serviceCategoryService.restoreServiceCategory(req.params.id!),
        );
    } catch (err) {
      next(err);
    }
  }
}

export const serviceCategoryController = new ServiceCategoryController();
