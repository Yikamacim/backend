import jwt from "jsonwebtoken";
import type { TokenPayload, Tokens } from "../../../@types/tokens";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { UnexpectedAuthError } from "../../../app/schemas/ServerError";
import type { SessionBundle } from "../@types/session";
import { TokenHelper } from "../app/helpers/TokenHelper";
import { AuthProvider } from "./AuthProvider";

export class AuthHandler implements IHandler {
  public constructor(private readonly provider = new AuthProvider()) {}

  public async verify(token: string): Promise<ClientError[]> {
    try {
      const payload = jwt.verify(token, EnvironmentHelper.get().jwtSecret);
      if (!PayloadHelper.isValidPayload(payload)) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Try getting the account
      const myAccount = await this.provider.getAccount(payload.accountId);
      // If no account found
      if (myAccount === null) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Check if account type matches
      if (payload.accountType !== myAccount.accountType) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // If refresh token
      if (!TokenHelper.isAccessToken(payload)) {
        // Verify session
        const mySession = await this.provider.getSession(payload.sessionId);
        // If no session found
        if (mySession === null) {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
        // Check if accountId matches
        if (payload.accountId !== mySession.accountId) {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
        // Check if refreshToken matches
        if (token !== mySession.refreshToken) {
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
  public getPayload(token: string): TokenPayload {
    return jwt.verify(token, EnvironmentHelper.get().jwtSecret) as TokenPayload;
  }

  public async generate(bundle: SessionBundle): Promise<Tokens> {
    return await this.provider.createOrUpdateMySession(bundle);
  }

  public async refresh(payload: TokenPayload): Promise<Tokens> {
    const session = await this.provider.getSession(payload.sessionId);
    if (session === null) {
      throw new UnexpectedAuthError();
    }
    return await this.provider.createOrUpdateMySession({
      accountId: payload.accountId,
      accountType: payload.accountType,
      deviceName: session.deviceName,
      sessionKey: session.sessionKey,
    });
  }

  public async revoke(payload: TokenPayload): Promise<void> {
    await this.provider.deleteSession(payload.sessionId);
  }
}
