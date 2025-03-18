import type { ProviderResponse } from "../../../@types/responses";
import type { SessionData } from "../../../@types/sessions";
import type { TokenPayload, Tokens } from "../../../@types/tokens";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedQueryResultError } from "../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { SessionModel } from "../../../common/models/SessionModel";
import { AccountProvider } from "../../../common/providers/AccountProvider";
import { SessionProvider } from "../../../common/providers/SessionProvider";
import { SessionQueries } from "../../../common/queries/SessionQueries";
import { SessionConstants } from "../app/constants/SessionConstants";
import { TokenHelper } from "../app/helpers/TokenHelper";

export class AuthProvider implements IProvider {
  public constructor(
    private readonly accountProvider = new AccountProvider(),
    private readonly sessionProvider = new SessionProvider(),
  ) {
    this.getAccount = this.accountProvider.getAccountById.bind(this.accountProvider);
    this.getSession = this.sessionProvider.getSessionById.bind(this.accountProvider);
  }

  public getAccount: typeof this.accountProvider.getAccountById;
  public getSession: typeof this.sessionProvider.getSessionById;

  public async createOrUpdateSession(sessionData: SessionData): Promise<ProviderResponse<Tokens>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults = await DbConstants.POOL.query(SessionQueries.GET_SESSIONS_$ACID, [
        sessionData.accountId,
      ]);
      const sessionRecords: unknown[] = sessionResults.rows;
      if (!sessionRecords) {
        throw new UnexpectedQueryResultError();
      }
      const sessions = SessionModel.fromRecords(sessionRecords);
      // Try to find session
      const session = sessions.find(
        (session: SessionModel) => session.sessionKey === sessionData.sessionKey,
      );
      // Check if session is found
      if (!session) {
        // Session not found, create one
        const tokens = await this.createSession(sessionData);
        // If account has more than max sessions, delete the oldest one
        await this.eliminateSessionIfNecessary(sessions);
        return await ResponseUtil.providerResponse(tokens);
      } else {
        // Session found, update it
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return await ResponseUtil.providerResponse(await this.updateSession(sessionData, session));
      }
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteSession(sessionId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(SessionQueries.DELETE_SESSION_$SSID, [sessionId]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PRIVATE METHODS >------------------------------------< //

  private async createSession(sessionData: SessionData): Promise<Tokens> {
    const sessionResults = await DbConstants.POOL.query(
      SessionQueries.INSERT_SESSION_RT_$ACID_$DVNM_$SKEY,
      [sessionData.accountId, sessionData.deviceName, sessionData.sessionKey],
    );
    const sessionRecord: unknown = sessionResults.rows[0];
    if (!sessionRecord) {
      throw new UnexpectedQueryResultError();
    }
    const session = SessionModel.fromRecord(sessionRecord);
    // Create payload
    const payload: TokenPayload = {
      accountId: sessionData.accountId,
      accountType: sessionData.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens = TokenHelper.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(SessionQueries.UPDATE_SESSION_$SSID_$DVNM_$RTOKEN, [
      session.sessionId,
      sessionData.deviceName,
      tokens.refreshToken,
    ]);
    // Return tokens
    return tokens;
  }

  private async eliminateSessionIfNecessary(sessions: SessionModel[]): Promise<void> {
    const sessionCount = sessions.length + 1;
    // If account has more than max sessions, delete the oldest one
    if (sessionCount > SessionConstants.MAX_SESSION_COUNT) {
      // Find the oldest session
      const oldestSession = sessions.reduce((prev: SessionModel, curr: SessionModel) => {
        return curr.lastActivityDate < prev.lastActivityDate ? curr : prev;
      });
      await DbConstants.POOL.query(SessionQueries.DELETE_SESSION_$SSID, [oldestSession.sessionId]);
    }
  }

  private async updateSession(sessionData: SessionData, session: SessionModel): Promise<Tokens> {
    // Create payload
    const payload: TokenPayload = {
      accountId: sessionData.accountId,
      accountType: sessionData.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens = TokenHelper.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(SessionQueries.UPDATE_SESSION_$SSID_$DVNM_$RTOKEN, [
      session.sessionId,
      sessionData.deviceName,
      tokens.refreshToken,
    ]);
    // Return tokens
    return tokens;
  }
}
