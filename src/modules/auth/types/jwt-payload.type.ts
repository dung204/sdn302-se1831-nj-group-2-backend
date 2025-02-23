import { Role } from '@/modules/user/enums';

export type JwtPayload = {
  sub: string;
  role?: Role;
  exp?: number;
};
