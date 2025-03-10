import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import {
  computerDto,
  computerQueryDto,
  createComputerDto,
  updateComputerDto,
} from '@/modules/computer/dtos';
import { computerService } from '@/modules/computer/services';

class ComputerController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = computerQueryDto.parse(req.query);
      res.status(HttpStatusCode.OK).json(
        await computerService.findAllAndCount({
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
      const dto = computerQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await computerService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatusCode.OK).json({
        data: computerDto.parse(
          await computerService.findOneById(req.params.id!),
        ),
      });
    } catch (err) {
      next(err);
    }
  }

  async createComputer(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createComputerDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await computerService.createComputer(dto));
    } catch (err) {
      next(err);
    }
  }

  async updateComputer(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateComputerDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(await computerService.updateComputer(req.params.id!, dto));
    } catch (err) {
      next(err);
    }
  }

  async softDeleteComputer(req: Request, res: Response, next: NextFunction) {
    try {
      await computerService.softDeleteComputer(req.params.id!);
      res.status(HttpStatusCode.OK).json({ message: 'Deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  async restoreComputer(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await computerService.restoreComputer(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const computerController = new ComputerController();
