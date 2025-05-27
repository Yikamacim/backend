import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { QuiltViewModel } from "../models/QuiltViewModel";
import { QuiltViewQueries } from "../queries/QuiltViewQueries";

export class QuiltProvider implements IProvider {
  public async getMyQuilt(
    accountId: number,
    quiltId: number,
  ): Promise<ProviderResponse<QuiltViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILT_$ACID_$QLID, [
        accountId,
        quiltId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return QuiltViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getQuiltByItemId(itemId: number): Promise<ProviderResponse<QuiltViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(QuiltViewQueries.GET_QUILT_$ITID, [itemId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return QuiltViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
