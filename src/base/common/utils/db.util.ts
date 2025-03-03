import { Types } from 'mongoose';

import { BadRequestException } from '@/base/common/exceptions';

export const convertToObjectId = (id: string): Types.ObjectId => {
  if (!id || typeof id !== 'string') {
    throw new BadRequestException('Invalid ID format');
  }

  try {
    return new Types.ObjectId(id);
  } catch (error) {
    throw new BadRequestException(
      `Invalid MongoDB ObjectId format ${id}, ${error}`,
    );
  }
};
