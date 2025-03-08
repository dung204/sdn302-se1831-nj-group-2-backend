import { z } from 'zod';

import { createProviderDto } from './create-provider.dto';

export const updateProviderDto = createProviderDto.partial();

export type UpdateProviderDto = z.input<typeof updateProviderDto>;
