import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { CurtainViewModel } from "../models/CurtainViewModel";
import { CurtainViewQueries } from "../queries/CurtainViewQueries";

export class CurtainProvider implements IProvider {
  public async getCurtain(curtainId: number): Promise<ProviderResponse<CurtainViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAIN_$CRID, [
        curtainId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return CurtainViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyCurtain(
    accountId: number,
    curtainId: number,
  ): Promise<ProviderResponse<CurtainViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAIN_$ACID_$CRID, [
        accountId,
        curtainId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return CurtainViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
