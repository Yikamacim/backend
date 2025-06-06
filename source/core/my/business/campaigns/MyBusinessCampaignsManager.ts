import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { CampaignEntity } from "../../../../common/entities/CampaignEntity";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { ServiceMediaRules } from "../../../../common/rules/ServiceMediaRules";
import { MyBusinessCampaignsProvider } from "./MyBusinessCampaignsProvider";
import type { MyBusinessCampaignsParams } from "./schemas/MyBusinessCampaignsParams";
import type { MyBusinessCampaignsRequest } from "./schemas/MyBusinessCampaignsRequest";
import { MyBusinessCampaignsResponse } from "./schemas/MyBusinessCampaignsResponse";

export class MyBusinessCampaignsManager implements IManager {
  public constructor(private readonly provider = new MyBusinessCampaignsProvider()) {}

  public async getMyBusinessCampaigns(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessCampaignsResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const campaigns = await this.provider.getCampaigns(business.businessId);
    const entities: CampaignEntity[] = [];
    for (const campaign of campaigns) {
      const media = await this.provider.getMedia(campaign.mediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
          null,
        );
      }
      const mediaEntity = await MediaHelper.mediaToEntity(media);
      entities.push(new CampaignEntity(campaign, mediaEntity));
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessCampaignsResponse.fromEntities(entities),
    );
  }

  public async postMyBusinessCampaigns(
    payload: TokenPayload,
    request: MyBusinessCampaignsRequest,
  ): Promise<ManagerResponse<MyBusinessCampaignsResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const findMediaResult = await MediaHelper.findMyMedia(payload.accountId, request.mediaId);
    if (findMediaResult.isLeft()) {
      return findMediaResult.get();
    }
    const media = findMediaResult.get();
    const checkMediaResult = await MediaHelper.checkMedia(media, ServiceMediaRules.ALLOWED_TYPES);
    if (checkMediaResult.isLeft()) {
      return checkMediaResult.get();
    }
    const mediaEntity = await MediaHelper.mediaToEntity(media);
    const campaign = await this.provider.createCampaign(
      business.businessId,
      request.title,
      request.mediaId,
      request.description,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessCampaignsResponse.fromEntity(new CampaignEntity(campaign, mediaEntity)),
    );
  }

  public async getMyBusinessCampaigns$(
    payload: TokenPayload,
    params: MyBusinessCampaignsParams,
  ): Promise<ManagerResponse<MyBusinessCampaignsResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const campaign = await this.provider.getCampaign(
      business.businessId,
      parseInt(params.campaignId),
    );
    if (campaign === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CAMPAIGN_NOT_FOUND)],
        null,
      );
    }
    const media = await this.provider.getMedia(campaign.mediaId);
    if (media === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID)],
        null,
      );
    }
    const mediaEntity = await MediaHelper.mediaToEntity(media);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessCampaignsResponse.fromEntity(new CampaignEntity(campaign, mediaEntity)),
    );
  }

  public async deleteMyBusinessCampaigns$(
    payload: TokenPayload,
    params: MyBusinessCampaignsParams,
  ): Promise<ManagerResponse<null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const campaign = await this.provider.getCampaign(
      business.businessId,
      parseInt(params.campaignId),
    );
    if (campaign === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CAMPAIGN_NOT_FOUND)],
        null,
      );
    }
    await this.provider.deleteCampaign(campaign.campaignId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
