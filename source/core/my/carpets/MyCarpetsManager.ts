import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyCarpetsProvider } from "./MyCarpetsProvider";
import type { MyCarpetsParams } from "./schemas/MyCarpetsParams";
import type { MyCarpetsRequest } from "./schemas/MyCarpetsRequest";
import { MyCarpetsResponse } from "./schemas/MyCarpetsResponse";

export class MyCarpetsManager implements IManager {
  public constructor(private readonly provider = new MyCarpetsProvider()) {}

  public async getMyCarpets(payload: TokenPayload): Promise<ManagerResponse<MyCarpetsResponse[]>> {
    const myCarpets = await this.provider.getMyCarpets(payload.accountId);
    const responses: MyCarpetsResponse[] = [];
    for (const myCarpet of myCarpets) {
      const medias = await this.provider.getItemMedias(myCarpet.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyCarpetsResponse.fromModel(myCarpet, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyCarpets(
    payload: TokenPayload,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const myCarpet = await this.provider.createCarpet(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.carpetMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyCarpetsResponse.fromModel(myCarpet, mediaDatas),
    );
  }

  public async getMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myCarpet.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCarpetsResponse.fromModel(myCarpet, mediaDatas),
    );
  }

  public async putMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const oldMedias = await this.provider.getItemMedias(myCarpet.itemId);
    const myUpdatedCarpet = await this.provider.updateCarpet(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myCarpet.carpetId,
      myCarpet.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.width,
      request.length,
      request.carpetMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCarpetsResponse.fromModel(myUpdatedCarpet, mediaDatas),
    );
  }

  public async deleteMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<null>> {
    const myCarpet = await this.provider.getMyCarpet(payload.accountId, parseInt(params.carpetId));
    if (myCarpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myCarpet.itemId);
    await this.provider.deleteCarpet(
      myCarpet.itemId,
      myCarpet.carpetId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
