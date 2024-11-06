import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import type { Token, TokenPayload } from "../../../@types/tokens";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import type { HandlerResponse } from "../@types/responses";
import { PayloadHelper } from "../app/helpers/PayloadHelper";
import type { IVerifier } from "../app/interfaces/IVerifier";
import { AccountHandler } from "./AccountHandler";
import { SessionHandler } from "./SessionHandler";

export class TokenVerifier implements IVerifier {
  private readonly mToken: Token;

  public constructor(token: Token) {
    this.mToken = token;
  }

  public async verify(isRefreshToken = false): Promise<boolean> {
    const JWT_SECRET: Secret = EnvironmentHelper.get().jwtSecret;
    const tokenPayload: JwtPayload | string = jwt.verify(this.mToken, JWT_SECRET);
    if (!PayloadHelper.isValidPayload(tokenPayload)) {
      return false;
    }
    const accountVerified: HandlerResponse<boolean> =
      await AccountHandler.verifyAccount(tokenPayload);
    if (!isRefreshToken) {
      return accountVerified.data;
    } else {
      const sessionVerified: HandlerResponse<boolean> = await SessionHandler.verifySession(
        this.mToken,
        tokenPayload,
      );
      return accountVerified.data && sessionVerified.data;
    }
  }

  public getPayload(): TokenPayload {
    const JWT_SECRET: Secret = EnvironmentHelper.get().jwtSecret;
    // Since we already verified the token in the middleware, we can safely cast to TokenPayload
    return jwt.verify(this.mToken, JWT_SECRET) as TokenPayload;
  }
}
