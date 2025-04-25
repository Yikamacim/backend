import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ApprovalState } from "../../../common/enums/ApprovalState";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { AdminApprovalsProvider } from "./AdminApprovalsProvider";
import type { AdminApprovalsParams } from "./schemas/AdminApprovalsParams";
import type { MyAdminApprovalsRequest } from "./schemas/AdminApprovalsRequest";
import { AdminApprovalsResponse } from "./schemas/AdminApprovalsResponse";

export class AdminApprovalsManager implements IManager {
  public constructor(private readonly provider = new AdminApprovalsProvider()) {}

  public async getAdminApprovals(): Promise<ManagerResponse<AdminApprovalsResponse[]>> {
    const approvals = await this.provider.getPendingApprovals();
    const responses: AdminApprovalsResponse[] = [];
    for (const approval of approvals) {
      const medias = await this.provider.getApprovalMedias(approval.businessId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(AdminApprovalsResponse.fromModel(approval, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async getAdminApprovals$(
    params: AdminApprovalsParams,
  ): Promise<ManagerResponse<AdminApprovalsResponse | null>> {
    const approvals = await this.provider.getApproval(parseInt(params.businessId));
    if (approvals === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getApprovalMedias(approvals.businessId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AdminApprovalsResponse.fromModel(approvals, mediaDatas),
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
        [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_NOT_FOUND)],
        null,
      );
    }
    const updatedApproval = await this.provider.updateApproval(
      approval.businessId,
      request.isApproved ? ApprovalState.APPROVED : ApprovalState.REJECTED,
      request.reason,
    );
    const medias = await this.provider.getApprovalMedias(approval.businessId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AdminApprovalsResponse.fromModel(updatedApproval, mediaDatas),
    );
  }
}
