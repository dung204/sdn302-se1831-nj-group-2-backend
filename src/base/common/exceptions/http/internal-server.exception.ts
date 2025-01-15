import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class InternalServerException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }
}
