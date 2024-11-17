import jwt from "jsonwebtoken";
import type { AccessTokenPayload, TokenPayload, Tokens } from "../../../../@types/tokens";
import { EnvironmentHelper } from "../../../../app/helpers/EnvironmentHelper";
import { PayloadHelper } from "../../../../app/helpers/PayloadHelper";
import type { IHelper } from "../../../../app/interfaces/IHelper";
import { AuthConstants } from "../constants/AuthConstants";

export class TokenHelper implements IHelper {
  public static generateTokens(payload: TokenPayload): Tokens {
    const accessTokenPayload: AccessTokenPayload = {
      ...payload,
      isAccessToken: true,
    };
    const accessToken = jwt.sign(accessTokenPayload, EnvironmentHelper.get().jwtSecret, {
      expiresIn: AuthConstants.ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refreshToken = jwt.sign(payload, EnvironmentHelper.get().jwtSecret, {
      expiresIn: AuthConstants.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public static isAccessToken(obj: unknown): obj is AccessTokenPayload {
    if (!PayloadHelper.isValidPayload(obj)) {
      return false;
    }
    const payload = obj as AccessTokenPayload;
    return typeof payload.isAccessToken === "boolean" && payload.isAccessToken;
  }
}
