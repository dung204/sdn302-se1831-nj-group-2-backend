import { Role } from '@/modules/user/enums';

export type LoginSuccessDto = {
  id: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};
