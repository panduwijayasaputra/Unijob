import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

enum TokenType {
  RESET_PASSWORD = 'resetPassword',
  RESEND_EMAIL = 'resendEmail',
}

const TokenTypeTime = {
  [TokenType.RESET_PASSWORD]: '15m',
  [TokenType.RESEND_EMAIL]: '15d',
};

@Injectable()
export class GenerateTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Function to generate token for reset password and resend email.
   * The token will be used to verify the user and ensure that the user
   * has not been tampered with.
   *
   * @param payload - The payload to generate the token for
   * @param type - The type of token to generate
   * @returns A string containing the generated token
   */
  async generateToken(payload: {
    data: object;
    sub: string;
    type: keyof typeof TokenType;
  }): Promise<string> {
    const tokenTypeValue = TokenType[payload.type];
    const expiresIn = TokenTypeTime[tokenTypeValue];

    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });
  }
}
