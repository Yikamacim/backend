import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { SofaViewModel } from "../models/SofaViewModel";
import { SofaViewQueries } from "../queries/SofaViewQueries";

export class SofaProvider implements IProvider {
  public async getMySofa(
    accountId: number,
    sofaId: number,
  ): Promise<ProviderResponse<SofaViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFA_$ACID_$SFID, [
        accountId,
        sofaId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return SofaViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getSofaByItemId(itemId: number): Promise<ProviderResponse<SofaViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(SofaViewQueries.GET_SOFA_$ITID, [itemId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return SofaViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
