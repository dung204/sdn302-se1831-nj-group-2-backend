import { NextFunction, Request, Response } from 'express';

import { ForbiddenException } from '@/base/common/exceptions';
import { UnauthorizedException } from '@/base/common/exceptions/http/unauthorized.exception';
import { JwtUtils } from '@/modules/auth/utils';
import { Role } from '@/modules/user/enums';
import { userService } from '@/modules/user/services';

/**
 * Middleware function to guard routes based on user roles.
 *
 * @param allowRoles - An array of roles that are allowed to access the route. Default to all {@link Role}s
 * @returns A middleware that checks the user's role and token validity.
 *
 * @throws {UnauthorizedException} If the access token is malformed or missing.
 * @throws {ForbiddenException} If the user's role is not included in the allowed roles.
 *
 * @example
 * ```typescript
 * app.use('/admin', AuthGuard([Role.ADMIN])); // Only ADMIN can access this route
 * app.use('/private', AuthGuard([Role.ADMIN, Role.STAFF, Role.OWNER])) // Only ADMIN, STAFF, OWNER can access this route
 * ```
 */
export const AuthGuard =
  (allowRoles: Role[] = Object.values(Role)) =>
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Malformed access token.');
      }

      const jwtToken = bearerToken.replaceAll('Bearer ', '');
      const { sub: userId, role } = JwtUtils.verifyAccessToken(jwtToken);

      if (!allowRoles.includes(role!)) {
        throw new ForbiddenException();
      }

      const user = await userService.findOneById(userId as string);
      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
