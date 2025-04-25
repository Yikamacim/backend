import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ApprovalModel } from "../../../../common/models/ApprovalModel";
import { ApprovalMediaProvider } from "../../../../common/providers/ApprovalMediaProvider";
import { ApprovalProvider } from "../../../../common/providers/ApprovalProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { ApprovalMediaQueries } from "../../../../common/queries/ApprovalMediaQueries";
import { ApprovalQueries } from "../../../../common/queries/ApprovalQueries";

export class MyBusinessApprovalProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly approvalProvider = new ApprovalProvider(),
    private readonly approvalMediaProvider = new ApprovalMediaProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getApproval = this.approvalProvider.getApproval.bind(this.approvalProvider);
    this.getApprovalMedias = this.approvalMediaProvider.getApprovalMedias.bind(
      this.approvalMediaProvider,
    );
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getApproval: typeof this.approvalProvider.getApproval;
  public readonly getApprovalMedias: typeof this.approvalMediaProvider.getApprovalMedias;

  public async createApproval(
    businessId: number,
    message: string | null,
    mediaIds: number[],
  ): Promise<ProviderResponse<ApprovalModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteApprovalMedias(businessId);
      await this.partialDeleteApproval(businessId);
      const approval = await this.partialCreateApproval(businessId, message);
      await this.partialCreateApprovalMedias(businessId, mediaIds);
      return await ResponseUtil.providerResponse(approval);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteApproval(businessId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteApprovalMedias(businessId);
      await this.partialDeleteApproval(businessId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateApproval(
    businessId: number,
    message: string | null,
  ): Promise<ProviderResponse<ApprovalModel>> {
    const results = await DbConstants.POOL.query(ApprovalQueries.INSERT_APPROVAL_$BSID_$MSG, [
      businessId,
      message,
    ]);
    const record: unknown = results.rows[0];
    return ApprovalModel.fromRecord(record);
  }

  private async partialDeleteApproval(businessId: number): Promise<void> {
    await DbConstants.POOL.query(ApprovalQueries.DELETE_APPROVAL_$BSID, [businessId]);
  }

  private async partialCreateApprovalMedias(businessId: number, mediaIds: number[]): Promise<void> {
    for (const mediaId of mediaIds) {
      await DbConstants.POOL.query(ApprovalMediaQueries.INSERT_APPROVAL_MEDIA_$BSID_$MDID, [
        businessId,
        mediaId,
      ]);
    }
  }

  private async partialDeleteApprovalMedias(businessId: number): Promise<void> {
    await DbConstants.POOL.query(ApprovalMediaQueries.DELETE_APPROVAL_MEDIAS_$BSID, [businessId]);
  }
}
