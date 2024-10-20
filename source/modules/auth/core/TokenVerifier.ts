import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import type { Token, TokenPayload } from "../../../@types/tokens.d.ts";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper.ts";
import type { HandlerResponse } from "../@types/responses.d.ts";
import { PayloadHelper } from "../app/helpers/PayloadHelper.ts";
import type { IVerifier } from "../app/interfaces/IVerifier.ts";
import { AccountHandler } from "./AccountHandler.ts";
import { SessionHandler } from "./SessionHandler.ts";

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
    const accountVerified: HandlerResponse<boolean> = await AccountHandler.verifyAccount(
      tokenPayload,
    );
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
