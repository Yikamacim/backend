import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ChairViewModel } from "../models/ChairViewModel";
import { ChairViewQueries } from "../queries/ChairViewQueries";

export class ChairProvider implements IProvider {
  public async getMyChair(
    accountId: number,
    chairId: number,
  ): Promise<ProviderResponse<ChairViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ChairViewQueries.GET_CHAIR_$ACID_$CHID, [
        accountId,
        chairId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return ChairViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getChairByItemId(itemId: number): Promise<ProviderResponse<ChairViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ChairViewQueries.GET_CHAIR_$ITID, [itemId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return ChairViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
