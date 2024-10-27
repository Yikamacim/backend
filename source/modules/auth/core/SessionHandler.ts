import type { QueryResult } from "pg";
import type { SessionData } from "../../../@types/sessions.d.ts";
import type { Token, TokenPayload, Tokens } from "../../../@types/tokens.d.ts";
import { DbConstants } from "../../../app/constants/DbConstants.ts";
import { UnexpectedQueryResultError } from "../../../app/schemas/ServerError.ts";
import type { HandlerResponse } from "../@types/responses.d.ts";
import { SessionConstants } from "../app/constants/SessionConstants.ts";
import type { IHandler } from "../app/interfaces/IHandler.ts";
import { AuthResponseUtil } from "../app/utils/AuthResponseUtil.ts";
import { SessionModel } from "../common/models/SessionModel.ts";
import { SessionQueries } from "../common/queries/SessionQueries.ts";
import { TokenHandler } from "./TokenHandler.ts";

export class SessionHandler implements IHandler {
  public static async verifySession(
    refreshToken: Token,
    tokenPayload: TokenPayload,
  ): Promise<HandlerResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults: QueryResult = await DbConstants.POOL.query(
        SessionQueries.GET_SESSION_$SSID,
        [
          tokenPayload.sessionId,
        ],
      );
      const sessionRecord: unknown = sessionResults.rows[0];
      if (!sessionRecord) {
        return await AuthResponseUtil.handlerResponse(false);
      }
      const session: SessionModel = SessionModel.fromRecord(sessionRecord);
      return await AuthResponseUtil.handlerResponse(
        tokenPayload.accountId === session.accountId && refreshToken === session.refreshToken,
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public static async createOrUpdateSession(
    sessionData: SessionData,
  ): Promise<HandlerResponse<Tokens>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults: QueryResult = await DbConstants.POOL.query(
        SessionQueries.GET_SESSIONS_$ACID,
        [
          sessionData.accountId,
        ],
      );
      const sessionRecords: unknown[] = sessionResults.rows;
      if (!sessionRecords) {
        throw new UnexpectedQueryResultError();
      }
      if (sessionRecords.length === 0) {
        // Account has no session, create one
        return await AuthResponseUtil.handlerResponse(
          await SessionHandler.createSession(sessionData),
        );
      }
      const sessions: SessionModel[] = SessionModel.fromRecords(sessionRecords);
      // Account has session(s), find one with matching session key
      const session: SessionModel | undefined = sessions.find(
        (session: SessionModel): boolean => session.sessionKey === sessionData.sessionKey,
      );
      if (session) {
        // Session found, update it
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return await AuthResponseUtil.handlerResponse(
          await SessionHandler.updateSession(sessionData, session),
        );
      } else {
        // Session not found, create one
        const tokens: Tokens = await SessionHandler.createSession(sessionData);
        // If account has more than max sessions, delete the oldest one
        await SessionHandler.eliminateSessionIfNecessary(sessions);
        return await AuthResponseUtil.handlerResponse(tokens);
      }
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  private static async createSession(sessionData: SessionData): Promise<Tokens> {
    const sessionResults: QueryResult = await DbConstants.POOL.query(
      SessionQueries.INSERT_SESSION_RT_$ACID_$DVNM_$SKEY,
      [sessionData.accountId, sessionData.deviceName, sessionData.sessionKey],
    );
    const sessionRecord: unknown = sessionResults.rows[0];
    if (!sessionRecord) {
      throw new UnexpectedQueryResultError();
    }
    const session: SessionModel = SessionModel.fromRecord(sessionRecord);
    // Create payload
    const payload: TokenPayload = {
      accountId: sessionData.accountId,
      accountType: sessionData.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(SessionQueries.UPDATE_SESSION_$SSID_$DVNM_$RTOKEN, [
      session.sessionId,
      sessionData.deviceName,
      tokens.refreshToken,
    ]);
    // Return tokens
    return tokens;
  }

  private static async eliminateSessionIfNecessary(sessions: SessionModel[]): Promise<void> {
    const sessionCount: number = sessions.length + 1;
    // If account has more than max sessions, delete the oldest one
    if (sessionCount > SessionConstants.MAX_SESSION_COUNT) {
      // Find the oldest session
      const oldestSession: SessionModel = sessions.reduce(
        (prev: SessionModel, curr: SessionModel): SessionModel => {
          return curr.lastActivityDate < prev.lastActivityDate ? curr : prev;
        },
      );
      await DbConstants.POOL.query(SessionQueries.DELETE_SESSION_$SSID, [oldestSession.sessionId]);
    }
  }

  private static async updateSession(
    sessionData: SessionData,
    session: SessionModel,
  ): Promise<Tokens> {
    // Create payload
    const payload: TokenPayload = {
      accountId: sessionData.accountId,
      accountType: sessionData.accountType,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
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
