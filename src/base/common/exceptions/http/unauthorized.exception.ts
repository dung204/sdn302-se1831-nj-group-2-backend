import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
