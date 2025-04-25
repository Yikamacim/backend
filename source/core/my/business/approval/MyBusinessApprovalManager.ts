import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ApprovalState } from "../../../../common/enums/ApprovalState";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { ApprovalMediaRules } from "../../../../common/rules/ApprovalMediaRules";
import { MyBusinessApprovalProvider } from "./MyBusinessApprovalProvider";
import type { MyBusinessApprovalRequest } from "./schemas/MyBusinessApprovalRequest";
import { MyBusinessApprovalResponse } from "./schemas/MyBusinessApprovalResponse";

export class MyBusinessApprovalManager implements IManager {
  public constructor(private readonly provider = new MyBusinessApprovalProvider()) {}

  public async getMyBusinessApproval(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessApprovalResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const approval = await this.provider.getApproval(business.businessId);
    if (approval === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_NOT_FOUND)],
        null,
      );
    }
    const approvalMedias = await this.provider.getApprovalMedias(business.businessId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(approvalMedias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessApprovalResponse.fromModel(approval, mediaDatas),
    );
  }

  public async postMyBusinessApproval(
    payload: TokenPayload,
    request: MyBusinessApprovalRequest,
  ): Promise<ManagerResponse<MyBusinessApprovalResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const myBusinessApproval = await this.provider.getApproval(myBusiness.businessId);
    if (myBusinessApproval !== null) {
      if (myBusinessApproval.approvalState === ApprovalState.APPROVED) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_ALREADY_APPROVED)],
          null,
        );
      }
      if (myBusinessApproval.approvalState === ApprovalState.PENDING) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_ALREADY_PENDING)],
          null,
        );
      }
    }
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(
      medias,
      ApprovalMediaRules.ALLOWED_TYPES,
    );
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const myApproval = await this.provider.createApproval(
      myBusiness.businessId,
      request.message,
      medias.map((media) => media.mediaId),
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessApprovalResponse.fromModel(myApproval, mediaDatas),
    );
  }

  public async deleteMyBusinessApproval(payload: TokenPayload): Promise<ManagerResponse<null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const myBusinessApproval = await this.provider.getApproval(myBusiness.businessId);
    if (myBusinessApproval === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_APPROVAL_NOT_FOUND)],
        null,
      );
    }
    await this.provider.deleteApproval(myBusiness.businessId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
