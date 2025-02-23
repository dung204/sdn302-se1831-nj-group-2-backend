import { Role } from '@/modules/user/enums';

export type LoginResponseDto = {
  id: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};
