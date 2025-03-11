import { z } from 'zod';

import { PasswordUtils } from '@/modules/auth/utils';
import { Role } from '@/modules/user/enums/role.enum';

export const baseCreateUserDto = z.object({
  username: z.string(),
  password: z.string().transform((pwd) => PasswordUtils.hashPassword(pwd)),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string().nullable().optional(),
  role: z
    .enum([Role.BRANCH_ADMIN, Role.GUEST, Role.OWNER, Role.STAFF])
    .optional()
    .default(Role.GUEST),
  branch: z.string().optional(),
  citizenNumber: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  availableTime: z.coerce.number().nullable().optional(),
});

export const createUserDto = baseCreateUserDto.refine(
  ({ role, branch }) =>
    ([Role.OWNER, Role.GUEST].includes(role) && !branch) ||
    ([Role.BRANCH_ADMIN, Role.STAFF].includes(role) && branch),
  ({ role }) => {
    if ([Role.OWNER, Role.GUEST].includes(role)) {
      return {
        message: '`branch` is not allowed for role `OWNER` & `GUEST`',
        path: ['branch'],
      };
    }

    return {
      message: '`branch` is required for role `BRANCH_ADMIN` & `STAFF`',
      path: ['branch'],
    };
  },
);

export type CreateUserDto = z.infer<typeof createUserDto>;
