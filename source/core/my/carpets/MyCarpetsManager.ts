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
    const carpets = await this.provider.getMyActiveCarpets(payload.accountId);
    const responses: MyCarpetsResponse[] = [];
    for (const carpet of carpets) {
      const medias = await this.provider.getItemMedias(carpet.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyCarpetsResponse.fromModel(carpet, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyCarpets(
    payload: TokenPayload,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const carpet = await this.provider.createMyCarpet(
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
      MyCarpetsResponse.fromModel(carpet, mediaDatas),
    );
  }

  public async getMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const carpet = await this.provider.getMyActiveCarpet(
      payload.accountId,
      parseInt(params.carpetId),
    );
    if (carpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(carpet.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyCarpetsResponse.fromModel(carpet, mediaDatas),
    );
  }

  public async putMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
    request: MyCarpetsRequest,
  ): Promise<ManagerResponse<MyCarpetsResponse | null>> {
    const carpet = await this.provider.getMyActiveCarpet(
      payload.accountId,
      parseInt(params.carpetId),
    );
    if (carpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(carpet.itemId);
    const updatedCarpet = await this.provider.updateCarpet(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      carpet.carpetId,
      carpet.itemId,
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
      MyCarpetsResponse.fromModel(updatedCarpet, mediaDatas),
    );
  }

  public async deleteMyCarpets$(
    payload: TokenPayload,
    params: MyCarpetsParams,
  ): Promise<ManagerResponse<null>> {
    const carpet = await this.provider.getMyActiveCarpet(
      payload.accountId,
      parseInt(params.carpetId),
    );
    if (carpet === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CARPET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(carpet.itemId);
    await this.provider.archiveItem(
      carpet.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
