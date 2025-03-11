import { z } from 'zod';

import { baseCreateUserDto } from './create-user.dto';

export const updateUserDto = baseCreateUserDto.partial();

export type UpdateUserDto = z.infer<typeof updateUserDto>;
