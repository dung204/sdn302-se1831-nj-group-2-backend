import { z } from 'zod';

export const changePasswordDto = z.object({
  oldPassword: z.string().nonempty(),
  newPassword: z.string().nonempty(),
});

export type ChangePasswordDto = z.infer<typeof changePasswordDto>;
