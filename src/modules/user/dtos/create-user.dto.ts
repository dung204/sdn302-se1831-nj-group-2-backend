import { z } from 'zod';

import { PasswordUtils } from '@/modules/auth/utils';
import { Role } from '@/modules/user/enums/role.enum';

export const createUserDto = z.object({
  username: z.string(),
  password: z.string().transform((pwd) => PasswordUtils.hashPassword(pwd)),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string().nullable().optional(),
  role: z
    .enum([Role.ADMIN, Role.GUEST, Role.OWNER, Role.STAFF])
    .optional()
    .default(Role.GUEST),
  citizenNumber: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  availableTime: z.coerce.number().nullable().optional(),
});

export type CreateUserDto = z.input<typeof createUserDto>;
