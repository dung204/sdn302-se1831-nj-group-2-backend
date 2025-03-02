import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  private static workFactor = 10;

  public static hashPassword(password: string) {
    return bcrypt.hash(password, this.workFactor);
  }

  public static isPasswordMatched(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
