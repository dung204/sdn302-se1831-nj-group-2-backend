import * as jwt from 'jsonwebtoken';

import { envVariables } from '@/base/common/utils';
import { CustomJwtPayload } from '@/modules/auth/types';

export class JwtUtils {
  public static signAccessToken(payload: CustomJwtPayload) {
    return jwt.sign(payload, envVariables.JWT_ACCESS_SECRET, {
      expiresIn: envVariables.JWT_ACCESS_EXPIRATION,
    });
  }

  public static signRefreshToken(payload: CustomJwtPayload) {
    return jwt.sign(payload, envVariables.JWT_REFRESH_SECRET, {
      expiresIn: envVariables.JWT_REFRESH_EXPIRATION,
    });
  }

  public static verifyAccessToken(token: string): CustomJwtPayload {
    return jwt.verify(
      token,
      envVariables.JWT_ACCESS_SECRET,
    ) as CustomJwtPayload;
  }

  public static verifyRefreshToken(token: string): CustomJwtPayload {
    return jwt.verify(
      token,
      envVariables.JWT_REFRESH_SECRET,
    ) as CustomJwtPayload;
  }

  public static decodeToken(token: string): CustomJwtPayload {
    return jwt.decode(token) as CustomJwtPayload;
  }
}
