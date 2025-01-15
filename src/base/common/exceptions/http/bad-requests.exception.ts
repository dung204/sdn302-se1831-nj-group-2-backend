import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}
