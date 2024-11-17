import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SessionModel } from "../models/SessionModel";
import { SessionQueries } from "../queries/SessionQueries";

export class SessionProvider implements IProvider {
  public async getSessionById(sessionId: number): Promise<ProviderResponse<SessionModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SessionQueries.GET_SESSION_$SSID, [sessionId]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(SessionModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getSessionsByAccountId(
    accountId: number,
  ): Promise<ProviderResponse<SessionModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SessionQueries.GET_SESSIONS_$ACID, [accountId]);
      const records: unknown[] = results.rows;
      if (!records) {
        return await ResponseUtil.providerResponse([]);
      }
      return await ResponseUtil.providerResponse(SessionModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
