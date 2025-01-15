import { HttpStatusCode, httpStatusName } from '@/base/common/enums';

export class HttpException extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorName: string;

  constructor(statusCode: HttpStatusCode, message?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorName = httpStatusName[statusCode];
  }
}
