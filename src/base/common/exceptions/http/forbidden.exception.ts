import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
