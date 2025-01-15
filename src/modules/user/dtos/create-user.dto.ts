import { z } from 'zod';

import { Role } from '@/modules/user/enums/role.enum';

export const createUserDto = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.string().optional(),
  role: z.enum([Role.ADMIN, Role.USER]).optional(),
});

export type CreateUserDto = z.input<typeof createUserDto>;
