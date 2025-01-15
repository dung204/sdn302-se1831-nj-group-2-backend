import { HttpStatusCode } from '@/base/common/enums';

import type { Pagination } from './pagination.type';

export type SuccessResponseBody<T> = T extends unknown[]
  ? { data: T; meta: { pagination: Pagination } }
  : { data: T };

export type FailedResponseBody = {
  messages?: string[];
  errorName: string;
  statusCode: HttpStatusCode;
};
