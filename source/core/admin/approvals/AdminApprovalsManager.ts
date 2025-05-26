import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ApprovalEntity } from "../../../common/entities/ApprovalEntity";
import { EApprovalState } from "../../../common/enums/EApprovalState";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { AdminApprovalsProvider } from "./AdminApprovalsProvider";
import type { AdminApprovalsParams } from "./schemas/AdminApprovalsParams";
import type { MyAdminApprovalsRequest } from "./schemas/AdminApprovalsRequest";
import { AdminApprovalsResponse } from "./schemas/AdminApprovalsResponse";

export class AdminApprovalsManager implements IManager {
  public constructor(private readonly provider = new AdminApprovalsProvider()) {}

  public async getAdminApprovals(): Promise<ManagerResponse<AdminApprovalsResponse[]>> {
    const approvals = await this.provider.getPendingApprovals();
    const entities = await Promise.all(
      approvals.map(async (approval) => {
        return new ApprovalEntity(
          approval,
          await MediaHelper.mediasToEntities(
            await this.provider.getApprovalMedias(approval.businessId),
          ),
        );
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AdminApprovalsResponse.fromEntities(entities),
    );
  }

  public async getAdminApprovals$(
    params: AdminApprovalsParams,
  ): Promise<ManagerResponse<AdminApprovalsResponse | null>> {
    const approvals = await this.provider.getApproval(parseInt(params.businessId));
    if (approvals === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.APPROVAL_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getApprovalMedias(approvals.businessId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AdminApprovalsResponse.fromEntity(new ApprovalEntity(approvals, mediaEntities)),
    );
  }

  public async putAdminApprovals$(
    params: AdminApprovalsParams,
    request: MyAdminApprovalsRequest,
  ): Promise<ManagerResponse<AdminApprovalsResponse | null>> {
    const approval = await this.provider.getApproval(parseInt(params.businessId));
    if (approval === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.APPROVAL_NOT_FOUND)],
        null,
      );
    }
    const updatedApproval = await this.provider.updateApproval(
      approval.businessId,
      request.isApproved ? EApprovalState.APPROVED : EApprovalState.REJECTED,
      request.reason,
    );
    const medias = await this.provider.getApprovalMedias(approval.businessId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AdminApprovalsResponse.fromEntity(new ApprovalEntity(updatedApproval, mediaEntities)),
    );
  }
}
