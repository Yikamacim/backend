import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ApprovalMediaViewModel } from "../models/ApprovalMediaViewModel";
import { ApprovalMediaViewQueries } from "../queries/ApprovalMediaViewQueries";

export class ApprovalMediaProvider implements IProvider {
  public async getApprovalMedias(
    businessId: number,
  ): Promise<ProviderResponse<ApprovalMediaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        ApprovalMediaViewQueries.GET_APPROVAL_MEDIAS_$BSID,
        [businessId],
      );
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ApprovalMediaViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
