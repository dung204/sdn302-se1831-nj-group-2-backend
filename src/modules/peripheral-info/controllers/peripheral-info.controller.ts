import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import { peripheralInfoQueryDto } from '@/modules/peripheral-info/dtos';
import { createPeripheralInfoDto } from '@/modules/peripheral-info/dtos/create-peripheral-info.dto';
import { updatePeripheralInfoDto } from '@/modules/peripheral-info/dtos/update-peripheral-info.dto';
import { peripheralInfoService } from '@/modules/peripheral-info/services';

class PeripheralInfoController {
  /**
   * `[GET]` `/api/v1/peripheral-info`
   *
   * Get all existing (non-deleted) peripheral info
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = peripheralInfoQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await peripheralInfoService.findAllAndCount({
          ...dto,
          deleted: false,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/peripheral-info/deleted`
   *
   * Get all deleted peripheral info
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = peripheralInfoQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await peripheralInfoService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/peripheral-info/:id`
   *
   * Get an existing peripheral info by ID
   * @throws {NotFoundException} - if a peripheral info is not found by the provided ID
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await peripheralInfoService.findOneById(req.params.id!));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST]` `/api/v1/peripheral-info`
   *
   * Create a new peripheral info
   */
  async createPeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createPeripheralInfoDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await peripheralInfoService.createPeripheralInfo(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/peripheral-info/:id`
   *
   * Update an existing peripheral info
   * @throws {NotFoundException} - if a peripheral info is not found by the provided ID
   */
  async updatePeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updatePeripheralInfoDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await peripheralInfoService.updatePeripheralInfo(req.params.id!, dto),
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE]` `/api/v1/peripheral-info/:id`
   *
   * Soft delete an existing peripheral info
   * @throws {NotFoundException} - if a peripheral info is not found by the provided ID
   */
  async softDeletePeripheralInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await peripheralInfoService.softDeletePeripheralInfo(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/peripheral-info/restore/:id`
   *
   * Restore an existing soft-deleted peripheral info
   * @throws {NotFoundException} - if a peripheral info is not found or already restored
   */
  async restorePeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(
          await peripheralInfoService.restorePeripheralInfo(req.params.id!),
        );
    } catch (err) {
      next(err);
    }
  }
}

export const peripheralInfoController = new PeripheralInfoController();
