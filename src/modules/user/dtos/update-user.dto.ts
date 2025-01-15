import { z } from 'zod';

import { createUserDto } from './create-user.dto';

export const updateUserDto = createUserDto.partial();

export type UpdateUserDto = z.input<typeof updateUserDto>;
