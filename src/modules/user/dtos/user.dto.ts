import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { branchDto } from '@/modules/branch/dtos/branch.dto';
import { Role } from '@/modules/user/enums/role.enum';

const baseUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string().nullable(),
  branch: branchDto.optional(),
  role: z.enum([Role.BRANCH_ADMIN, Role.GUEST, Role.OWNER, Role.STAFF]),
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
