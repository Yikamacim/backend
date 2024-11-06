import jwt, { type Secret } from "jsonwebtoken";
import type { Token, TokenPayload, Tokens } from "../../../@types/tokens";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import { AuthConstants } from "../app/constants/AuthConstants";
import type { IHandler } from "../app/interfaces/IHandler";

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
