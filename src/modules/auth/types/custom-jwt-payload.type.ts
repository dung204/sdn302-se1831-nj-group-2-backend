import { JwtPayload } from 'jsonwebtoken';

import { Role } from '@/modules/user/enums';

export interface CustomJwtPayload extends JwtPayload {
  role?: Role;
}
