import { BadRequestException } from '@/base/common/exceptions';
import { SuccessResponseBody } from '@/base/common/types';
import { LoginResponseDto } from '@/modules/auth/dtos';
import { LoginRequestDto } from '@/modules/auth/dtos/login-request.dto';
import { JwtPayload } from '@/modules/auth/types';
import { JwtUtils, PasswordUtils } from '@/modules/auth/utils';
import { Role } from '@/modules/user/enums';
import { userService } from '@/modules/user/services';

class AuthService {
  async login({
    username,
    password,
  }: LoginRequestDto): Promise<SuccessResponseBody<LoginResponseDto>> {
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
        ...this.getTokens(user.id, user.role),
      },
    };
  }

  async refreshToken() {
    // TODO: implement this function
  }

  async logout() {
    // TODO: implement this function
  }

  async changePassword() {
    // TODO: implement this function
  }

  private getTokens(userId: string, role: Role) {
    const accessPayload: JwtPayload = {
      sub: userId,
    };

    const refreshPayload: JwtPayload = {
      ...accessPayload,
      role,
    };

    const accessToken = JwtUtils.signAccessToken(accessPayload);
    const refreshToken = JwtUtils.signRefreshToken(refreshPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
