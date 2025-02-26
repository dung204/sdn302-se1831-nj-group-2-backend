import { z } from 'zod';

export const refreshRequestDto = z.object({
  refreshToken: z.string(),
});
