import { z } from 'zod';

import { Role } from '@/modules/user/enums/role.enum';

export const userDto = z
  .object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string().nullable(),
    role: z.enum([Role.ADMIN, Role.USER]),
    createTimestamp: z.date(),
  })
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type UserDto = z.infer<typeof userDto>;
