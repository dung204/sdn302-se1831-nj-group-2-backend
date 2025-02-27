import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { Role } from '@/modules/user/enums/role.enum';

const baseUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  password: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  address: z.string().nullable(),
  role: z.enum([Role.ADMIN, Role.GUEST, Role.OWNER, Role.STAFF]),
  citizenNumber: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  availableTime: z.number().nullable(),
  createTimestamp: z.date(),
});

// transform: transform the data from schema to new data
// here: parse _id to id
export const userDto = baseUserSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

// merge: combine two Zod schemas into single schema
export const deletedUserDto = baseUserSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

// infer: is used to infer the type of a Zod schema
export type UserDto = z.infer<typeof userDto>;

export type DeletedUserDto = z.infer<typeof deletedUserDto>;
