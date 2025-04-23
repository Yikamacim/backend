import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyQuiltsProvider } from "./MyQuiltsProvider";
import type { MyQuiltsParams } from "./schemas/MyQuiltsParams";
import type { MyQuiltsRequest } from "./schemas/MyQuiltsRequest";
import { MyQuiltsResponse } from "./schemas/MyQuiltsResponse";

export class MyQuiltsManager implements IManager {
  public constructor(private readonly provider = new MyQuiltsProvider()) {}

  public async getMyQuilts(payload: TokenPayload): Promise<ManagerResponse<MyQuiltsResponse[]>> {
    const myQuilts = await this.provider.getMyQuilts(payload.accountId);
    const responses: MyQuiltsResponse[] = [];
    for (const myQuilt of myQuilts) {
      const medias = await this.provider.getItemMedias(myQuilt.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyQuiltsResponse.fromModel(myQuilt, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyQuilts(
    payload: TokenPayload,
    request: MyQuiltsRequest,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const myQuilt = await this.provider.createQuilt(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.quiltSize,
      request.quiltMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyQuiltsResponse.fromModel(myQuilt, mediaDatas),
    );
  }

  public async getMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myQuilt.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyQuiltsResponse.fromModel(myQuilt, mediaDatas),
    );
  }

  public async putMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
    request: MyQuiltsRequest,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(myQuilt.itemId);
    const myUpdatedQuilt = await this.provider.updateQuilt(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myQuilt.quiltId,
      myQuilt.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.quiltSize,
      request.quiltMaterial,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyQuiltsResponse.fromModel(myUpdatedQuilt, mediaDatas),
    );
  }

  public async deleteMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<null>> {
    const myQuilt = await this.provider.getMyQuilt(payload.accountId, parseInt(params.quiltId));
    if (myQuilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myQuilt.itemId);
    await this.provider.deleteQuilt(
      myQuilt.itemId,
      myQuilt.quiltId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
