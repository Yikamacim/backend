import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { SessionModel } from "../../../common/models/SessionModel";
import { SessionProvider } from "../../../common/providers/SessionProvider";
import { SessionQueries } from "../../../common/queries/SessionQueries";

export class MySessionsProvider implements IProvider {
  public constructor(private readonly sessionProvider = new SessionProvider()) {
    this.getMySessions = this.sessionProvider.getSessionsByAccountId.bind(this.sessionProvider);
  }

  public readonly getMySessions: typeof this.sessionProvider.getSessionsByAccountId;

  public async getMySession(
    accountId: number,
    sessionId: number,
  ): Promise<ProviderResponse<SessionModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SessionQueries.GET_SESSION_$ACID_$SSID, [
        accountId,
        sessionId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(SessionModel.fromRecord(record));
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
}
