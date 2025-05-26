import type { ProviderResponse } from "../../../@types/responses";
import type { TokenPayload, Tokens } from "../../../@types/tokens";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { SessionModel } from "../../../common/models/SessionModel";
import { AccountProvider } from "../../../common/providers/AccountProvider";
import { SessionProvider } from "../../../common/providers/SessionProvider";
import { SessionQueries } from "../../../common/queries/SessionQueries";
import type { SessionBundle } from "../@types/session";
import { SessionConstants } from "../app/constants/SessionConstants";
import { TokenHelper } from "../app/helpers/TokenHelper";

export class AuthProvider implements IProvider {
  public constructor(
    private readonly accountProvider = new AccountProvider(),
    private readonly sessionProvider = new SessionProvider(),
  ) {
    this.getAccount = this.accountProvider.getAccount.bind(this.accountProvider);
    this.getSession = this.sessionProvider.getSession.bind(this.accountProvider);
  }

  public readonly getAccount: typeof this.accountProvider.getAccount;
  public readonly getSession: typeof this.sessionProvider.getSession;

  public async createOrUpdateMySession(bundle: SessionBundle): Promise<ProviderResponse<Tokens>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults = await DbConstants.POOL.query(SessionQueries.GET_SESSIONS_$ACID, [
        bundle.accountId,
      ]);
      const sessionRecords: unknown[] = sessionResults.rows;
      const sessions = SessionModel.fromRecords(sessionRecords);
      // Try to find session
      const session = sessions.find(
        (session: SessionModel) => session.sessionKey === bundle.sessionKey,
      );
      // Check if session is found
      if (session === undefined) {
        // Session not found, create one
        const tokens = await this.partialCreateMySession(bundle);
        // If account has more than max sessions, delete the oldest one
        await this.partialPruneMySessions(sessions);
        return await ResponseUtil.providerResponse(tokens);
      } else {
        // Session found, update it
        return await ResponseUtil.providerResponse(
          await this.partialUpdateSession(bundle, session),
        );
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

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateMySession(bundle: SessionBundle): Promise<Tokens> {
    const sessionResults = await DbConstants.POOL.query(
      SessionQueries.INSERT_SESSION_RT_$ACID_$DVNM_$SKEY,
      [bundle.accountId, bundle.deviceName, bundle.sessionKey],
    );
    const sessionRecord: unknown = sessionResults.rows[0];
    const session = SessionModel.fromRecord(sessionRecord);
    // Create payload
    const payload: TokenPayload = {
      accountId: bundle.accountId,
      accountType: bundle.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens = TokenHelper.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(SessionQueries.UPDATE_SESSION_$SSID_$DVNM_$RTOKEN, [
      session.sessionId,
      bundle.deviceName,
      tokens.refreshToken,
    ]);
    // Return tokens
    return tokens;
  }

  private async partialPruneMySessions(sessions: SessionModel[]): Promise<void> {
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

  private async partialUpdateSession(
    bundle: SessionBundle,
    session: SessionModel,
  ): Promise<Tokens> {
    // Create payload
    const payload: TokenPayload = {
      accountId: bundle.accountId,
      accountType: bundle.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens = TokenHelper.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(SessionQueries.UPDATE_SESSION_$SSID_$DVNM_$RTOKEN, [
      session.sessionId,
      bundle.deviceName,
      tokens.refreshToken,
    ]);
    // Return tokens
    return tokens;
  }
}
