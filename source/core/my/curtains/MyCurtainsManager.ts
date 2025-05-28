import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CurtainEntity } from "../../../common/entities/CurtainEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyCurtainsProvider } from "./MyCurtainsProvider";
import type { MyCurtainsParams } from "./schemas/MyCurtainsParams";
import type { MyCurtainsRequest } from "./schemas/MyCurtainsRequest";
import { MyCurtainsResponse } from "./schemas/MyCurtainsResponse";

export class MyCurtainsManager implements IManager {
  public constructor(private readonly provider = new MyCurtainsProvider()) {}

  public async getMyCurtains(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyCurtainsResponse[]>> {
    const curtains = await this.provider.getMyActiveCurtains(payload.accountId);
    const entities = await Promise.all(
      curtains.map(async (curtain) => {
        const medias = await this.provider.getItemMedias(curtain.itemId);
        const mediaEntities = await MediaHelper.mediasToEntities(medias);
        return new CurtainEntity(curtain, mediaEntities);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCurtainsResponse.fromEntities(entities),
    );
  }

  public async postMyCurtains(
    payload: TokenPayload,
    request: MyCurtainsRequest,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const curtain = await this.provider.createMyCurtain(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.curtainType,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyCurtainsResponse.fromEntity(new CurtainEntity(curtain, mediaEntities)),
    );
  }

  public async getMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
    const curtain = await this.provider.getMyActiveCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (curtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(curtain.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCurtainsResponse.fromEntity(new CurtainEntity(curtain, mediaEntities)),
    );
  }

  public async putMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
    request: MyCurtainsRequest,
  ): Promise<ManagerResponse<MyCurtainsResponse | null>> {
    const curtain = await this.provider.getMyActiveCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (curtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID)],
        null,
      );
    }
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const oldMedias = await this.provider.getItemMedias(curtain.itemId);
    const updatedCurtain = await this.provider.updateCurtain(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      curtain.curtainId,
      curtain.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.curtainType,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCurtainsResponse.fromEntity(new CurtainEntity(updatedCurtain, mediaEntities)),
    );
  }

  public async deleteMyCurtains$(
    payload: TokenPayload,
    params: MyCurtainsParams,
  ): Promise<ManagerResponse<null>> {
    const curtain = await this.provider.getMyActiveCurtain(
      payload.accountId,
      parseInt(params.curtainId),
    );
    if (curtain === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(curtain.itemId);
    await this.provider.archiveItem(
      curtain.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
