import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  billDto,
  billQueryDto,
  createBillDto,
  updateBillDto,
} from '@/modules/bill/dtos';
import { billService } from '@/modules/bill/services';

class BillController {
  /**
   * [GET] /api/v1/bills
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = billQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await billService.findAllAndCount({ ...dto, deleted: false }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [GET] /api/v1/bills/deleted
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = billQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await billService.findAllAndCount({ ...dto, deleted: true }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [GET] /api/v1/bills/:id
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const bill = await billService.findOneById(req.params.id!);
      const formattedData = billDto.parse(bill);
      res.status(HttpStatusCode.OK).json({ data: formattedData });
    } catch (err) {
      next(err);
    }
  }

  /**
   * [POST] /api/v1/bills
   */
  async createBill(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = {
        ...req.body,
        startTimestamp: req.body.startTimestamp
          ? new Date(req.body.startTimestamp)
          : null,
        endTimestamp: req.body.endTimestamp
          ? new Date(req.body.endTimestamp)
          : null,
        maxEndTimestamp: req.body.maxEndTimestamp
          ? new Date(req.body.maxEndTimestamp)
          : null,
        maxHoldingTimestamp: req.body.maxHoldingTimestamp
          ? new Date(req.body.maxHoldingTimestamp)
          : undefined,
      };
      const newBill = createBillDto.parse(parsedData);
      res
        .status(HttpStatusCode.CREATED)
        .json(await billService.createBill(newBill));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [PATCH] /api/v1/bills/:id
   */
  async updateBill(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = {
        ...req.body,
        startTimestamp: req.body.startTimestamp
          ? new Date(req.body.startTimestamp)
          : undefined,
        endTimestamp: req.body.endTimestamp
          ? new Date(req.body.endTimestamp)
          : undefined,
        maxEndTimestamp: req.body.maxEndTimestamp
          ? new Date(req.body.maxEndTimestamp)
          : undefined,
        maxHoldingTimestamp: req.body.maxHoldingTimestamp
          ? new Date(req.body.maxHoldingTimestamp)
          : undefined,
      };
      const updatedBill = updateBillDto.parse(parsedData);
      res
        .status(HttpStatusCode.OK)
        .json(await billService.updateBill(req.params.id!, updatedBill));
    } catch (err) {
      next(err);
    }
  }

  /**
   * [DELETE] /api/v1/bills/:id
   *
   * Soft delete a bill
   * @throws {NotFoundException} - if a bill is not found by the provided ID
   */
  async softDeleteBill(req: Request, res: Response, next: NextFunction) {
    try {
      await billService.softDeleteBill(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * [PATCH] /api/v1/bills/restore/:id
   *
   * Restore a soft deleted bill
   * @throws {NotFoundException} - if a bill is not found by the provided ID
   */
  async restoreBill(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await billService.restoreBill(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const billController = new BillController();
