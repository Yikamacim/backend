import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
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
    const myBlankets = await this.provider.getMyBlankets(payload.accountId);
    const responses: MyBlanketsResponse[] = [];
    for (const myBlanket of myBlankets) {
      const medias = await this.provider.getItemMedias(myBlanket.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyBlanketsResponse.fromModel(myBlanket, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
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
    const myBlanket = await this.provider.createBlanket(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBlanketsResponse.fromModel(myBlanket, mediaDatas),
    );
  }

  public async getMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myBlanket.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBlanketsResponse.fromModel(myBlanket, mediaDatas),
    );
  }

  public async putMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
    request: MyBlanketsRequest,
  ): Promise<ManagerResponse<MyBlanketsResponse | null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(myBlanket.itemId);
    const myUpdatedBlanket = await this.provider.updateBlanket(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myBlanket.blanketId,
      myBlanket.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.blanketSize,
      request.blanketMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBlanketsResponse.fromModel(myUpdatedBlanket, mediaDatas),
    );
  }

  public async deleteMyBlankets$(
    payload: TokenPayload,
    params: MyBlanketsParams,
  ): Promise<ManagerResponse<null>> {
    const myBlanket = await this.provider.getMyBlanket(
      payload.accountId,
      parseInt(params.blanketId),
    );
    if (myBlanket === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BLANKET_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myBlanket.itemId);
    await this.provider.deleteBlanket(
      myBlanket.itemId,
      myBlanket.blanketId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
