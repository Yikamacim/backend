import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { EApprovalState } from "../enums/EApprovalState";
import { ApprovalModel } from "../models/ApprovalModel";
import { ApprovalQueries } from "../queries/ApprovalQueries";

export class ApprovalProvider implements IProvider {
  public async getPendingApprovals(): Promise<ProviderResponse<ApprovalModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ApprovalQueries.GET_APPROVALS_$STATE, [
        EApprovalState.PENDING,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ApprovalModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getApproval(businessId: number): Promise<ProviderResponse<ApprovalModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ApprovalQueries.GET_APPROVAL_$BSID, [
        businessId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(ApprovalModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateApproval(
    businessId: number,
    approvalState: EApprovalState,
    reason: string | null,
  ): Promise<ProviderResponse<ApprovalModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        ApprovalQueries.UPDATE_APPROVAL_$BSID_$STATE_$REASON,
        [businessId, approvalState, reason],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(ApprovalModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
