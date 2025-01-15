import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
