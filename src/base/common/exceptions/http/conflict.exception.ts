import { HttpStatusCode } from '@/base/common/enums';

import { HttpException } from './http.exception';

export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.CONFLICT, message);
  }
}
