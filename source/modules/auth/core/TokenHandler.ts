import jwt, { type Secret } from "jsonwebtoken";
import type { Token, TokenPayload, Tokens } from "../../../@types/tokens.d.ts";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper.ts";
import { AuthConstants } from "../app/constants/AuthConstants.ts";
import type { IHandler } from "../app/interfaces/IHandler.ts";

export class TokenHandler implements IHandler {
  public static generateTokens(payload: TokenPayload): Tokens {
    const JWT_SECRET: Secret = EnvironmentHelper.get().jwtSecret;
    const accessToken: Token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: AuthConstants.ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refreshToken: Token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: AuthConstants.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
