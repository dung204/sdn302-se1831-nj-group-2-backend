import { HttpStatusCode } from '@/base/common/enums';
import { Pagination, Search, Sorting } from '@/base/common/types';

export type SuccessResponseBody<T> = T extends unknown[]
  ? {
      data: T;
      meta: { pagination: Pagination; sorting: Sorting[]; search?: Search[] };
    }
  : { data: T };

export type FailedResponseBody = {
  messages?: string[];
  errorName: string;
  statusCode: HttpStatusCode;
};
