import { HydratedDocument } from 'mongoose';

import { BadRequestException } from '@/base/common/exceptions';
import { UnauthorizedException } from '@/base/common/exceptions/http/unauthorized.exception';
import { SuccessResponseBody } from '@/base/common/types';
import { envVariables } from '@/base/common/utils';
import { redis } from '@/base/redis';
import {
  ChangePasswordDto,
  LoginSuccessDto,
  RefreshSuccessDto,
} from '@/modules/auth/dtos';
import { LoginRequestDto } from '@/modules/auth/dtos/login-request.dto';
import { CustomJwtPayload } from '@/modules/auth/types';
import { JwtUtils, PasswordUtils } from '@/modules/auth/utils';
import { Role } from '@/modules/user/enums';
import { User } from '@/modules/user/models';
import { userService } from '@/modules/user/services';

class AuthService {
  private readonly BLACKLISTED = 'BLACKLISTED';

  async login({
    username,
    password,
  }: LoginRequestDto): Promise<SuccessResponseBody<LoginSuccessDto>> {
    const user = await userService.findOneByUsername(username);
    const isPasswordMatched = await PasswordUtils.isPasswordMatched(
      password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Password is incorrect.');
    }

    return {
      data: {
        id: user.id,
        role: user.role,
        ...(await this.getTokens(user.id, user.role)),
      },
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<SuccessResponseBody<RefreshSuccessDto>> {
    const isRefreshTokenBlacklisted =
      await this.isTokenBlacklisted(refreshToken);
    if (isRefreshTokenBlacklisted) {
      throw new UnauthorizedException('Refresh token is blacklisted.');
    }

    const { sub: userId } = JwtUtils.verifyRefreshToken(refreshToken);
    const { id, role } = await userService.findOneById(userId!);

    await this.blacklistToken(refreshToken);

    return {
      data: {
        id,
        role,
        ...(await this.getTokens(id, role)),
      },
    };
  }

  async logout() {
    // TODO: implement this function
  }

  async changePassword(
    user: HydratedDocument<User>,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const isPasswordMatched = await PasswordUtils.isPasswordMatched(
      oldPassword,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('Old password is incorrect.');
    }

    user.password = await PasswordUtils.hashPassword(newPassword);
    await user.save();
  }

  private async getTokens(userId: string, role: Role) {
    const refreshPayload: CustomJwtPayload = {
      sub: userId,
    };

    const accessPayload: CustomJwtPayload = {
      ...refreshPayload,
      role,
    };

    const accessToken = JwtUtils.signAccessToken(accessPayload);
    const refreshToken = JwtUtils.signRefreshToken(refreshPayload);

    await redis
      .getInstance()
      .set(userId, refreshToken, 'EXAT', envVariables.JWT_REFRESH_EXPIRATION);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async blacklistToken(token: string) {
    const { exp } = JwtUtils.decodeToken(token);
    await redis.getInstance().set(token, this.BLACKLISTED, 'EXAT', exp!);
  }

  async isTokenBlacklisted(token: string) {
    return (await redis.getInstance().get(token)) === this.BLACKLISTED;
  }
}

export const authService = new AuthService();
