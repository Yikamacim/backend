import jwt from "jsonwebtoken";
import type { SessionData } from "../../../@types/sessions";
import type { Token, TokenPayload, Tokens } from "../../../@types/tokens";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { UnexpectedAuthError } from "../../../app/schemas/ServerError";
import { TokenHelper } from "../app/helpers/TokenHelper";
import { AuthProvider } from "./AuthProvider";

export class AuthHandler implements IHandler {
  public constructor(private readonly provider = new AuthProvider()) {}

  public async verify(token: Token): Promise<ClientError[]> {
    try {
      const tokenPayload = jwt.verify(token, EnvironmentHelper.get().jwtSecret);
      if (!PayloadHelper.isValidPayload(tokenPayload)) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Try getting the account
      const prGetAccount = await this.provider.getAccount(tokenPayload.accountId);
      // If no account found
      if (prGetAccount.data === null) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Check if account type matches
      if (tokenPayload.accountType !== prGetAccount.data.accountType) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // If refresh token
      if (!TokenHelper.isAccessToken(tokenPayload)) {
        // Verify session
        const prGetSession = await this.provider.getSession(tokenPayload.sessionId);
        // If no session found
        if (prGetSession.data === null) {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
        // Check if accountId matches
        if (tokenPayload.accountId !== prGetSession.data.accountId) {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
        // Check if refreshToken matches
        if (token !== prGetSession.data.refreshToken) {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
      }
      // Everything ok
      return [];
    } catch (error) {
      // Token error
      if (error instanceof jwt.JsonWebTokenError) {
        if (error instanceof jwt.TokenExpiredError) {
          return [new ClientError(ClientErrorCode.EXPIRED_TOKEN)];
        } else {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
      } else {
        // Unknown error
        throw error;
      }
    }
  }

  /**
   * Call AuthHandler.verify before calling this method.
   */
  public getPayload(token: Token): TokenPayload {
    return jwt.verify(token, EnvironmentHelper.get().jwtSecret) as TokenPayload;
  }

  public async generate(sessionData: SessionData): Promise<Tokens> {
    return (await this.provider.createOrUpdateSession(sessionData)).data;
  }

  public async refresh(tokenPayload: TokenPayload): Promise<Tokens> {
    const currentSession = await this.provider.getSession(tokenPayload.sessionId);
    if (currentSession.data === null) {
      throw new UnexpectedAuthError();
    }
    return (
      await this.provider.createOrUpdateSession({
        accountId: tokenPayload.accountId,
        accountType: tokenPayload.accountType,
        deviceName: currentSession.data.deviceName,
        sessionKey: currentSession.data.sessionKey,
      })
    ).data;
  }

  public async revoke(tokenPayload: TokenPayload): Promise<void> {
    await this.provider.deleteSession(tokenPayload.sessionId);
  }
}
