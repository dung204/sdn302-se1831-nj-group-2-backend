import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';

import { providerQueryDto } from '../dtos';
import { createProviderDto } from '../dtos/create-provider.dto';
import { updateProviderDto } from '../dtos/update-provider.dto';
import { providerService } from '../service/provider.service';

class ProviderController {
  /**
   * [GET] /api/v1/provider
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = providerQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(
          await providerService.findAllAndCount({ ...dto, deleted: false }),
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * [GET] /api/v1/provider/deleted
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = providerQueryDto.parse(req.query);
      const deletedProviders =
        await providerService.findAllDeletedAndCount(dto);
      res.status(HttpStatusCode.OK).json(deletedProviders);
    } catch (err) {
      next(err);
    }
  }

  /**
   * [GET] /api/v1/provider/:id
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await providerService.findOneById(req.params.id!));
    } catch (error) {
      next(error);
    }
  }

  /**
   * [POST] /api/v1/provider
   */
  async createProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createProviderDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await providerService.createProvider(dto));
    } catch (error) {
      next(error);
    }
  }

  // /**
  //  * [PATCH] /api/v1/provider/:id
  //  */
  async updateProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateProviderDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(await providerService.updateProvider(req.params.id!, dto));
    } catch (err) {
      next(err);
    }
  }

  // /**
  //  * [DELETE] /api/v1/provider/:id
  //  */
  async softDeleteProvider(req: Request, res: Response, next: NextFunction) {
    try {
      await providerService.softDeleteProvider(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  // /**
  //  * [PATCH] /api/v1/provider/users/:id
  //  */
  async restoreProvider(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await providerService.restoreProvider(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const providerController = new ProviderController();
