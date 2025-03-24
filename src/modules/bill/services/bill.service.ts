import { HydratedDocument, RootFilterQuery, SortOrder } from 'mongoose';

import { NotFoundException } from '@/base/common/exceptions/http/not-found.exception';
import { SuccessResponseBody } from '@/base/common/types';
import {
  BillDto,
  BillQueryDto,
  CreateBillDto,
  DeletedBillDto,
  UpdateBillDto,
  billDto,
  deletedBillDto,
} from '@/modules/bill/dtos';
import { Bill, BillModel } from '@/modules/bill/models';

import { ServiceStatus } from '../enums';

class BillService {
  findAllAndCount(
    commonQueryDto: BillQueryDto & { deleted?: false },
  ): Promise<SuccessResponseBody<BillDto[]>>;
  findAllAndCount(
    commonQueryDto: BillQueryDto & { deleted: true },
  ): Promise<SuccessResponseBody<DeletedBillDto[]>>;
  async findAllAndCount({
    page,
    pageSize,
    sorting,
    deleted,
    ...filter
  }: BillQueryDto): Promise<SuccessResponseBody<BillDto[] | DeletedBillDto[]>> {
    const {
      fromCreateTimestamp,
      toCreateTimestamp,
      fromDeleteTimestamp,
      toDeleteTimestamp,
      fromStartTimestamp,
      toStartTimestamp,
      fromEndTimestamp,
      toEndTimestamp,
      fromMaxEndTimestamp,
      toMaxEndTimestamp,
      fromMaxHoldingTimestamp,
      toMaxHoldingTimestamp,
      minTotalPrice,
      maxTotalPrice,
      serviceStatus,
      ...otherFilters
    } = filter;

    const queryFilter: RootFilterQuery<Bill> = {
      deleteTimestamp: !deleted
        ? null
        : {
            $ne: null,
            ...(fromDeleteTimestamp && { $gte: fromDeleteTimestamp }),
            ...(toDeleteTimestamp && { $lte: toDeleteTimestamp }),
          },
      ...otherFilters,
    };

    // Handle date ranges
    if (fromCreateTimestamp || toCreateTimestamp) {
      queryFilter.createTimestamp = {
        ...(fromCreateTimestamp && { $gte: fromCreateTimestamp }),
        ...(toCreateTimestamp && { $lte: toCreateTimestamp }),
      };
    }

    if (fromStartTimestamp || toStartTimestamp) {
      queryFilter.startTimestamp = {
        ...(fromStartTimestamp && { $gte: fromStartTimestamp }),
        ...(toStartTimestamp && { $lte: toStartTimestamp }),
      };
    }

    if (fromEndTimestamp || toEndTimestamp) {
      queryFilter.endTimestamp = {
        ...(fromEndTimestamp && { $gte: fromEndTimestamp }),
        ...(toEndTimestamp && { $lte: toEndTimestamp }),
      };
    }

    if (fromMaxEndTimestamp || toMaxEndTimestamp) {
      queryFilter.maxEndTimestamp = {
        ...(fromMaxEndTimestamp && { $gte: fromMaxEndTimestamp }),
        ...(toMaxEndTimestamp && { $lte: toMaxEndTimestamp }),
      };
    }

    if (fromMaxHoldingTimestamp || toMaxHoldingTimestamp) {
      queryFilter.maxHoldingTimestamp = {
        ...(fromMaxHoldingTimestamp && { $gte: fromMaxHoldingTimestamp }),
        ...(toMaxHoldingTimestamp && { $lte: toMaxHoldingTimestamp }),
      };
    }

    // Handle price range
    if (minTotalPrice !== undefined || maxTotalPrice !== undefined) {
      queryFilter.totalPrice = {
        ...(minTotalPrice !== undefined && { $gte: minTotalPrice }),
        ...(maxTotalPrice !== undefined && { $lte: maxTotalPrice }),
      };
    }

    // Handle service status filtering
    if (serviceStatus) {
      queryFilter['services.status'] = { $in: serviceStatus };
    }

    const query = BillModel.find(queryFilter)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(
        sorting.map(
          ({ field, direction }) =>
            [field === 'id' ? '_id' : field, direction] as [string, SortOrder],
        ),
      );

    const bills = await query.exec();
    const total = await BillModel.countDocuments(queryFilter).exec();
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: bills.map((bill) =>
        deleted ? deletedBillDto.parse(bill) : billDto.parse(bill),
      ),
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage,
        },
        sorting,
        filter,
      },
    };
  }

  findAllDeleted(billQueryDto: BillQueryDto) {
    return this.findAllAndCount({ ...billQueryDto, deleted: true });
  }

  async findOneById(id: string): Promise<HydratedDocument<Bill>> {
    const bill = await BillModel.findOne({
      _id: id,
      deleteTimestamp: null,
    });

    if (!bill) {
      throw new NotFoundException('Bill not found.');
    }

    return bill;
  }

  async createBill(
    createBillDto: CreateBillDto,
  ): Promise<SuccessResponseBody<BillDto>> {
    const {
      user,
      computer,
      services,
      startTimestamp,
      endTimestamp,
      maxEndTimestamp,
      maxHoldingTimestamp,
    } = createBillDto;
    const newBill = new BillModel({
      user,
      computer: {
        _id: computer,
      },
      services,
      startTimestamp,
      endTimestamp,
      maxEndTimestamp,
      maxHoldingTimestamp,
    });

    await newBill.save();

    return {
      data: billDto.parse(await newBill.populate('user')),
    };
  }

  async updateBill(
    id: string,
    updateBillDto: UpdateBillDto,
  ): Promise<SuccessResponseBody<BillDto>> {
    const {
      user,
      computer,
      services,
      startTimestamp,
      endTimestamp,
      maxEndTimestamp,
      maxHoldingTimestamp,
    } = updateBillDto;

    // Find the existing bill first
    const existingBill = await BillModel.findById(id);

    if (!existingBill) {
      throw new NotFoundException('Bill not found.');
    }

    if (user !== undefined) existingBill.user = user;
    if (computer !== undefined) {
      // Mark computer as modified to ensure pre-save hook processes it
      // This will let the pre-save hook fetch pricePerHour from Computer
      existingBill.markModified('computer');
      existingBill.computer._id = computer;
    }

    if (services !== undefined) {
      // Mark services as modified to ensure pre-save hook processes them
      // This will let the pre-save hook fetch name and price from ServiceTable
      existingBill.markModified('services');
      existingBill.services = services.map((service) => ({
        _id: service._id,
        name: '',
        price: 0,
        quantity: service.quantity || 1,
        status: service.status || ServiceStatus.PENDING,
      }));
    }

    if (startTimestamp !== undefined)
      existingBill.startTimestamp = startTimestamp;
    if (endTimestamp !== undefined) existingBill.endTimestamp = endTimestamp;
    if (maxEndTimestamp !== undefined)
      existingBill.maxEndTimestamp = maxEndTimestamp;
    if (maxHoldingTimestamp !== undefined)
      existingBill.maxHoldingTimestamp = maxHoldingTimestamp;

    // Save to trigger pre-save hooks
    await existingBill.save();

    return {
      data: billDto.parse(await existingBill.populate('user')),
    };
  }

  softDeleteBill(id: string) {
    return BillModel.updateOne(
      { _id: id, deleteTimestamp: null },
      { deleteTimestamp: Date.now() },
    );
  }

  async restoreBill(id: string): Promise<SuccessResponseBody<BillDto>> {
    const updatedBill = await BillModel.findOneAndUpdate(
      { _id: id, deleteTimestamp: { $ne: null } },
      { deleteTimestamp: null },
      { new: true },
    );

    if (!updatedBill) {
      throw new NotFoundException(
        'Bill not found or has been already restored.',
      );
    }

    return {
      data: billDto.parse(updatedBill),
    };
  }
}

export const billService = new BillService();
