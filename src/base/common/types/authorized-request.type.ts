import { Request } from 'express';

import { User } from '@/modules/user/models';

export interface AuthorizedRequest extends Request {
  user: User;
}
