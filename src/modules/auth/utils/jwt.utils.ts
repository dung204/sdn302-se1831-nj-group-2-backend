import * as jwt from 'jsonwebtoken';

import { envVariables } from '@/base/common/utils';
import { JwtPayload } from '@/modules/auth/types';

export class JwtUtils {
  public static signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, envVariables.JWT_ACCESS_SECRET, {
      expiresIn: envVariables.JWT_ACCESS_EXPIRATION,
    });
  }

  public static signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, envVariables.JWT_REFRESH_SECRET, {
      expiresIn: envVariables.JWT_REFRESH_EXPIRATION,
    });
  }

  public static verifyAccessToken(token: string) {
    return jwt.verify(token, envVariables.JWT_ACCESS_SECRET);
  }

  public static verifyRefreshToken(token: string) {
    return jwt.verify(token, envVariables.JWT_REFRESH_SECRET);
  }
}
