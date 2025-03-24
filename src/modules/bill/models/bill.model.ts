import { CallbackError, Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';
import { ServiceStatus } from '@/modules/bill/enums';
import { ComputerModel } from '@/modules/computer/models';
import { computerService } from '@/modules/computer/services';
import { ServiceTableModel } from '@/modules/service-table/models';
import { serviceTableService } from '@/modules/service-table/services';
import { UserModel } from '@/modules/user/models';
import { userService } from '@/modules/user/services';

export interface Bill extends BaseModel {
  user: string;
  computer: {
    _id: string;
    name: string;
    pricePerHour: number;
    holdingFee: number;
  };
  services: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    status: ServiceStatus;
  }[];
  startTimestamp: Date | null;
  endTimestamp: Date | null;
  maxEndTimestamp: Date | null;
  maxHoldingTimestamp: Date | null;
  totalPrice: number;
}

const billSchema = new Schema<Bill>({
  ...baseModelSchemaDefinition,
  user: {
    type: String,
    ref: UserModel,
    required: true,
  },
  computer: {
    _id: {
      type: String,
      ref: ComputerModel,
      required: true,
    },
    name: String,
    pricePerHour: Number,
    holdingFee: Number,
  },
  services: [
    {
      _id: {
        type: String,
        ref: ServiceTableModel,
        required: true,
      },
      name: String,
      quantity: { type: Number, required: false, default: 1 },
      price: Number,
      status: {
        type: String,
        enum: Object.values(ServiceStatus),
        default: ServiceStatus.PENDING,
      },
    },
  ],

  startTimestamp: Date || null,
  endTimestamp: Date || null,
  maxEndTimestamp: Date || null,
  maxHoldingTimestamp: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

billSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.populate('user');
  next();
});

// Add pre-save middleware to process bill data
billSchema.pre(['save'], async function (next) {
  try {
    // Verify user exists
    if (this.isNew || this.isModified('user')) {
      await userService.findOneById(this.user);
    }

    // Verify and populate computer data
    if (this.isNew || this.isModified('computer._id')) {
      const computerId = this.isNew ? this.computer._id : this.computer._id;
      const computer = await computerService.findOneById(computerId);

      // Update computer data
      this.computer = {
        _id: computer.data.id,
        name: computer.data.name,
        pricePerHour: computer.data.pricePerHour,
        holdingFee: 0, //computer.data.holdingFee,
      };
    }

    // Process services if provided
    if (this.isNew || this.isModified('services')) {
      if (this.services && this.services.length > 0) {
        const processedServices = [];

        for (const serviceItem of this.services) {
          // If it's already a fully populated service object, just keep it
          if (
            serviceItem._id &&
            serviceItem.name &&
            serviceItem.price !== undefined
          ) {
            processedServices.push(serviceItem);
          } else if (serviceItem._id) {
            // If it's coming from API with serviceId format
            const service = await serviceTableService.findOneById(
              serviceItem._id,
            );
            processedServices.push({
              _id: service.data.id,
              name: service.data.name,
              quantity: serviceItem.quantity || 1,
              price: service.data.price,
              status: serviceItem.status || ServiceStatus.PENDING,
            });
          }
        }

        this.services = processedServices;
      }
    }

    // Update totalPrice if endTimestamp is modified
    if (
      this.isModified('endTimestamp') &&
      this.startTimestamp &&
      this.endTimestamp
    ) {
      const startTimestamp = new Date(this.startTimestamp);
      const endTimestamp = new Date(this.endTimestamp);
      const createTimestamp = new Date(this.createTimestamp);

      const durationInHours =
        (endTimestamp.getTime() - startTimestamp.getTime()) / (1000 * 60 * 60);
      const holdingDurationInMinutes =
        (startTimestamp.getTime() - createTimestamp.getTime()) / (1000 * 60);

      let totalPrice = durationInHours * this.computer.pricePerHour;

      if (holdingDurationInMinutes > 15) {
        totalPrice +=
          this.computer.holdingFee * (holdingDurationInMinutes / 60);
      }

      for (const service of this.services) {
        if (service.status === ServiceStatus.COMPLETED) {
          totalPrice += service.quantity * service.price;
        }
      }

      this.totalPrice = totalPrice;
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const BillModel = model<Bill>('Bill', billSchema, 'bills');
