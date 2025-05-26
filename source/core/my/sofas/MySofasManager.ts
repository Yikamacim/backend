import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { SofaEntity } from "../../../common/entities/SofaEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MySofasProvider } from "./MySofasProvider";
import type { MySofasParams } from "./schemas/MySofasParams";
import type { MySofasRequest } from "./schemas/MySofasRequest";
import { MySofasResponse } from "./schemas/MySofasResponse";

export class MySofasManager implements IManager {
  public constructor(private readonly provider = new MySofasProvider()) {}

  public async getMySofas(payload: TokenPayload): Promise<ManagerResponse<MySofasResponse[]>> {
    const sofas = await this.provider.getMyActiveSofas(payload.accountId);
    const entities = await Promise.all(
      sofas.map(async (mySofa) => {
        const medias = await this.provider.getItemMedias(mySofa.itemId);
        const mediaEntities = await MediaHelper.mediasToEntities(medias);
        return new SofaEntity(mySofa, mediaEntities);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromEntities(entities),
    );
  }

  public async postMySofas(
    payload: TokenPayload,
    request: MySofasRequest,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const sofa = await this.provider.createMySofa(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.isCushioned,
      request.sofaType,
      request.sofaMaterial,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MySofasResponse.fromEntity(new SofaEntity(sofa, mediaEntities)),
    );
  }

  public async getMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const sofa = await this.provider.getMyActiveSofa(payload.accountId, parseInt(params.sofaId));
    if (sofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(sofa.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromEntity(new SofaEntity(sofa, mediaEntities)),
    );
  }

  public async putMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
    request: MySofasRequest,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const sofa = await this.provider.getMyActiveSofa(payload.accountId, parseInt(params.sofaId));
    if (sofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(sofa.itemId);
    const updatedSofa = await this.provider.updateSofa(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      sofa.sofaId,
      sofa.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.isCushioned,
      request.sofaType,
      request.sofaMaterial,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromEntity(new SofaEntity(updatedSofa, mediaEntities)),
    );
  }

  public async deleteMySofas$(
    payload: TokenPayload,
    params: MySofasParams,
  ): Promise<ManagerResponse<null>> {
    const sofa = await this.provider.getMyActiveSofa(payload.accountId, parseInt(params.sofaId));
    if (sofa === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SOFA_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(sofa.itemId);
    await this.provider.archiveItem(
      sofa.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
