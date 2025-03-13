import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import { peripheralQueryDto } from '@/modules/peripheral/dtos';
import { createPeripheralDto } from '@/modules/peripheral/dtos/create-peripheral.dto';
import { updatePeripheralDto } from '@/modules/peripheral/dtos/update-peripheral.dto';
import { peripheralService } from '@/modules/peripheral/services';

class PeripheralController {
  /**
   * `[GET]` `/api/v1/peripherals`
   *
   * Get all existing (non-deleted) peripheral info
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = peripheralQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await peripheralService.findAllAndCount({
          ...dto,
          deleted: false,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/peripherals/deleted`
   *
   * Get all deleted peripheral info
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = peripheralQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await peripheralService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/peripherals/:id`
   *
   * Get an existing peripheral info by ID
   * @throws {NotFoundException} - if a peripheral info is not found by the provided ID
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await peripheralService.findOneById(req.params.id!));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST]` `/api/v1/peripherals`
   *
   * Create a new peripheral info
   */
  async createPeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createPeripheralDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await peripheralService.createPeripheralInfo(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/peripherals/:id`
   *
   * Update an existing peripheral info
   * @throws {NotFoundException} - if a peripheral info is not found by the provided ID
   */
  async updatePeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updatePeripheralDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(
          await peripheralService.updatePeripheralInfo(req.params.id!, dto),
        );
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE]` `/api/v1/peripherals/:id`
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
      await peripheralService.softDeletePeripheralInfo(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/peripherals/restore/:id`
   *
   * Restore an existing soft-deleted peripheral info
   * @throws {NotFoundException} - if a peripheral info is not found or already restored
   */
  async restorePeripheralInfo(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await peripheralService.restorePeripheralInfo(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const peripheralController = new PeripheralController();
