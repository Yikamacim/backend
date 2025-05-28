import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BlanketEntity } from "../../../common/entities/BlanketEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyBlanketsProvider } from "./MyBlanketsProvider";
import type { MyBlanketsParams } from "./schemas/MyBlanketsParams";
import type { MyBlanketsRequest } from "./schemas/MyBlanketsRequest";
import { MyBlanketsResponse } from "./schemas/MyBlanketsResponse";

export class MyBlanketsManager implements IManager {
  public constructor(private readonly provider = new MyBlanketsProvider()) {}

  public async getMyBlankets(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBlanketsResponse[]>> {
    const blankets = await this.provider.getMyActiveBlankets(payload.accountId);
    const entities = await Promise.all(
      blankets.map(async (myBlanket) => {
        const medias = await this.provider.getItemMedias(myBlanket.itemId);
        const mediaEntites = await MediaHelper.mediasToEntities(medias);
        return new BlanketEntity(myBlanket, mediaEntites);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBlanketsResponse.fromEntities(entities),
    );
  }

  public async postMyBlankets(
    payload: TokenPayload,
    request: MyBlanketsRequest,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const blanket = await this.provider.createMyBlanket(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBlanketsResponse.fromEntity(new BlanketEntity(blanket, mediaEntities)),
    );
  }

  public async getMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const blanket = await this.provider.getMyActiveBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (blanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(blanket.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBlanketsResponse.fromEntity(new BlanketEntity(blanket, mediaEntities)),
    );
  }

  public async putMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
    request: MyBlanketsRequest,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const blanket = await this.provider.getMyActiveBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (blanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(blanket.itemId);
    const updatedBlanket = await this.provider.updateBlanket(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      blanket.blanketId,
      blanket.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBlanketsResponse.fromEntity(new BlanketEntity(updatedBlanket, mediaEntities)),
    );
  }

  public async deleteMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<null>> {
    const blanket = await this.provider.getMyActiveBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (blanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(blanket.itemId);
    await this.provider.archiveItem(
      blanket.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
