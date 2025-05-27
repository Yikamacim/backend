import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { BlanketViewModel } from "../models/BlanketViewModel";
import { BlanketViewQueries } from "../queries/BlanketViewQueries";

export class BlanketProvider implements IProvider {
  public async getMyBlanket(
    accountId: number,
    blanketId: number,
  ): Promise<ProviderResponse<BlanketViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BlanketViewQueries.GET_BLANKET_$ACID_$BLID, [
        accountId,
        blanketId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return BlanketViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getBlanketByItemId(
    itemId: number,
  ): Promise<ProviderResponse<BlanketViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BlanketViewQueries.GET_BLANKET_$ITID, [itemId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return BlanketViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
