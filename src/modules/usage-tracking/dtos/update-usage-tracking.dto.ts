import { z } from 'zod';

import { createUsageTrackingDto } from './create-usage-tracking.dto';

export const updateUsageTrackingDto = createUsageTrackingDto.partial();

export type UpdateUsageTrackingDto = z.input<typeof updateUsageTrackingDto>;
