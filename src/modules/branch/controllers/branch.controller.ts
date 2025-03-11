import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from '@/base/common/enums';
import { branchQueryDto } from '@/modules/branch/dtos';
import { createBranchDto } from '@/modules/branch/dtos/create-branch.dto';
import { updateBranchDto } from '@/modules/branch/dtos/update-branch.dto';
import { branchService } from '@/modules/branch/services/branch.service';

class BranchController {
  /**
   * `[GET]` `/api/v1/branches`
   *
   * Get all existing (non-deleted) branches
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = branchQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await branchService.findAllAndCount({ ...dto, deleted: false }));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/branches/deleted`
   *
   * Get all deleted branches
   */
  async findAllDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = branchQueryDto.parse(req.query);
      res
        .status(HttpStatusCode.OK)
        .json(await branchService.findAllDeletedAndCount(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[GET]` `/api/v1/branches/:id`
   *
   * Get an existing branch by ID
   * @throws {NotFoundException} - if a branch is not found by the provided ID
   */
  async findOneById(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await branchService.findOneById(req.params.id!));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[POST]` `/api/v1/branches`
   *
   * Create a new branch
   */
  async createBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createBranchDto.parse(req.body);
      res
        .status(HttpStatusCode.CREATED)
        .json(await branchService.createBranch(dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/branches/:id`
   *
   * Update an existing branch
   * @throws {NotFoundException} - if a branch is not found by the provided ID
   */
  async updateBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateBranchDto.parse(req.body);
      res
        .status(HttpStatusCode.OK)
        .json(await branchService.updateBranch(req.params.id!, dto));
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[DELETE]` `/api/v1/branches/:id`
   *
   * Soft delete an existing branch
   * @throws {NotFoundException} - if a branch is not found by the provided ID
   */
  async softDeleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
      await branchService.softDeleteBranch(req.params.id!);
      res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (err) {
      next(err);
    }
  }

  /**
   * `[PATCH]` `/api/v1/branches/restore/:id`
   *
   * Restore an existing soft-deleted branch
   * @throws {NotFoundException} - if a branch is not found or already restored
   */
  async restoreBranch(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(HttpStatusCode.OK)
        .json(await branchService.restoreBranch(req.params.id!));
    } catch (err) {
      next(err);
    }
  }
}

export const branchController = new BranchController();
