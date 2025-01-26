import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { Role } from '@/modules/user/enums/role.enum';

const baseUserSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string().nullable(),
  role: z.enum([Role.ADMIN, Role.USER]),
  createTimestamp: z.date(),
});

export const userDto = baseUserSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedUserDto = baseUserSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type UserDto = z.infer<typeof userDto>;

export type DeletedUserDto = z.infer<typeof deletedUserDto>;
