import type { QueryResult } from "pg";
import type { RawTokenData, Token, TokenPayload, Tokens } from "../../../@types/tokens.d.ts";
import { DbConstants } from "../../../app/constants/DbConstants.ts";
import { UnexpectedQueryResultError } from "../../../app/schemas/ServerError.ts";
import type { HandlerResponse } from "../@types/responses.d.ts";
import { SessionConstants } from "../app/constants/SessionConstants.ts";
import type { IHandler } from "../app/interfaces/IHandler.ts";
import { SessionModel } from "../app/models/SessionModel.ts";
import { AuthResponseUtil } from "../app/utils/AuthResponseUtil.ts";
import { TokenHandler } from "./TokenHandler.ts";

export class SessionHandler implements IHandler {
  public static async verifySession(
    refreshToken: Token,
    tokenPayload: TokenPayload,
  ): Promise<HandlerResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults: QueryResult = await DbConstants.POOL.query(Queries.GET_SESSION$SSID, [
        tokenPayload.sessionId,
      ]);
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
    tokenData: RawTokenData,
  ): Promise<HandlerResponse<Tokens>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const sessionResults: QueryResult = await DbConstants.POOL.query(Queries.GET_SESSIONS$ACID, [
        tokenData.accountId,
      ]);
      const sessionRecords: unknown[] = sessionResults.rows;
      if (!sessionRecords) {
        throw new UnexpectedQueryResultError();
      }
      if (sessionRecords.length === 0) {
        // Account has no sessions, create one
        return await AuthResponseUtil.handlerResponse(
          await SessionHandler.createSession(tokenData),
        );
      }
      const sessions: SessionModel[] = SessionModel.fromRecords(sessionRecords);
      // Account has sessions, find one with matching session key
      const session: SessionModel | undefined = sessions.find(
        (session: SessionModel): boolean => session.sessionKey === tokenData.sessionKey,
      );
      if (session) {
        // Session found, update it
        await DbConstants.POOL.query(DbConstants.COMMIT);
        return await AuthResponseUtil.handlerResponse(
          await SessionHandler.updateSession(tokenData, session),
        );
      } else {
        // Session not found, create one
        const tokens: Tokens = await SessionHandler.createSession(tokenData);
        // If account has more than max sessions, delete the oldest one
        await SessionHandler.eliminateSessionIfNecessary(sessions);
        return await AuthResponseUtil.handlerResponse(tokens);
      }
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  private static async createSession(tokenData: RawTokenData): Promise<Tokens> {
    const sessionResults: QueryResult = await DbConstants.POOL.query(
      Queries.INSERT_SESSION$ACID_$SKEY,
      [tokenData.accountId, tokenData.sessionKey],
    );
    const sessionRecord: unknown = sessionResults.rows[0];
    if (!sessionRecord) {
      throw new UnexpectedQueryResultError();
    }
    const session: SessionModel = SessionModel.fromRecord(sessionRecord);
    // Create payload
    const payload: TokenPayload = {
      accountId: tokenData.accountId,
      membership: tokenData.membership,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(Queries.UPDATE_SESSION$SSID_$RTOKEN_$DATE, [
      session.sessionId,
      tokens.refreshToken,
      new Date().toISOString(),
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
      await DbConstants.POOL.query(Queries.DELETE_SESSION$SSID, [oldestSession.sessionId]);
    }
  }

  private static async updateSession(
    tokenData: RawTokenData,
    session: SessionModel,
  ): Promise<Tokens> {
    // Create payload
    const payload: TokenPayload = {
      accountId: tokenData.accountId,
      membership: tokenData.membership,
      sessionId: session.sessionId,
    };
    // Generate tokens
    const tokens: Tokens = TokenHandler.generateTokens(payload);
    // Update session
    await DbConstants.POOL.query(Queries.UPDATE_SESSION$SSID_$RTOKEN_$DATE, [
      session.sessionId,
      tokens.refreshToken,
      new Date().toISOString(),
    ]);
    // Return tokens
    return tokens;
  }
}

enum Queries {
  GET_SESSIONS$ACID = `SELECT * FROM "Session" WHERE "accountId" = $1`,
  GET_SESSION$SSID = `SELECT * FROM "Session" WHERE "sessionId" = $1`,
  INSERT_SESSION$ACID_$SKEY =
    `INSERT INTO "Session" ("accountId", "sessionKey") VALUES ($1, $2) RETURNING *`,
  UPDATE_SESSION$SSID_$RTOKEN_$DATE =
    `UPDATE "Session" SET "refreshToken" = $2, "lastActivityDate" = $3 WHERE "sessionId" = $1`,
  DELETE_SESSION$SSID = `DELETE FROM "Session" WHERE "sessionId" = $1`,
}
