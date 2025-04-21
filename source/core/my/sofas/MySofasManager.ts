import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MySofasProvider } from "./MySofasProvider";
import type { MySofasParams } from "./schemas/MySofasParams";
import type { MySofasRequest } from "./schemas/MySofasRequest";
import { MySofasResponse } from "./schemas/MySofasResponse";

export class MySofasManager implements IManager {
  public constructor(private readonly provider = new MySofasProvider()) {}

  public async getMySofas(payload: TokenPayload): Promise<ManagerResponse<MySofasResponse[]>> {
    const mySofas = await this.provider.getMySofas(payload.accountId);
    const responses: MySofasResponse[] = [];
    for (const mySofa of mySofas) {
      const medias = await this.provider.getItemMedias(mySofa.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MySofasResponse.fromModel(mySofa, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMySofas(
    payload: TokenPayload,
    request: MySofasRequest,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const mySofa = await this.provider.createSofa(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.isCushioned,
      request.sofaType,
      request.sofaMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MySofasResponse.fromModel(mySofa, mediaDatas),
    );
  }

  public async getMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const mySofa = await this.provider.getMySofa(payload.accountId, parseInt(params.sofaId));
    if (mySofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(mySofa.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromModel(mySofa, mediaDatas),
    );
  }

  public async putMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
    request: MySofasRequest,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const mySofa = await this.provider.getMySofa(payload.accountId, parseInt(params.sofaId));
    if (mySofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(mySofa.itemId);
    const myUpdatedSofa = await this.provider.updateSofa(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      mySofa.sofaId,
      mySofa.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.isCushioned,
      request.sofaType,
      request.sofaMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromModel(myUpdatedSofa, mediaDatas),
    );
  }

  public async deleteMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
  ): Promise<ManagerResponse<null>> {
    const mySofa = await this.provider.getMySofa(payload.accountId, parseInt(params.sofaId));
    if (mySofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(mySofa.itemId);
    await this.provider.deleteSofa(
      mySofa.itemId,
      mySofa.sofaId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
