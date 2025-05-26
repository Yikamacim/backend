import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { CarpetViewModel } from "../models/CarpetViewModel";
import { CarpetViewQueries } from "../queries/CarpetViewQueries";

export class CarpetProvider implements IProvider {
  public async getCarpet(carpetId: number): Promise<ProviderResponse<CarpetViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CarpetViewQueries.GET_CARPET_$CPID, [carpetId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return CarpetViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyCarpet(
    accountId: number,
    carpetId: number,
  ): Promise<ProviderResponse<CarpetViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CarpetViewQueries.GET_CARPET_$ACID_$CPID, [
        accountId,
        carpetId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return CarpetViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
