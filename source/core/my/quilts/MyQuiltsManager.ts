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
    const quilts = await this.provider.getQuilts(payload.accountId);
    const responses: MyQuiltsResponse[] = [];
    for (const quilt of quilts) {
      const medias = await this.provider.getItemMedias(quilt.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyQuiltsResponse.fromModel(quilt, mediaDatas));
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
    const quilt = await this.provider.createQuilt(
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
      MyQuiltsResponse.fromModel(quilt, mediaDatas),
    );
  }

  public async getMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const quilt = await this.provider.getQuilt(payload.accountId, parseInt(params.quiltId));
    if (quilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(quilt.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyQuiltsResponse.fromModel(quilt, mediaDatas),
    );
  }

  public async putMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
    request: MyQuiltsRequest,
  ): Promise<ManagerResponse<MyQuiltsResponse | null>> {
    const quilt = await this.provider.getQuilt(payload.accountId, parseInt(params.quiltId));
    if (quilt === null) {
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
    const oldMedias = await this.provider.getItemMedias(quilt.itemId);
    const updatedQuilt = await this.provider.updateQuilt(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      quilt.quiltId,
      quilt.itemId,
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
      MyQuiltsResponse.fromModel(updatedQuilt, mediaDatas),
    );
  }

  public async deleteMyQuilts$(
    payload: TokenPayload,
    params: MyQuiltsParams,
  ): Promise<ManagerResponse<null>> {
    const quilt = await this.provider.getQuilt(payload.accountId, parseInt(params.quiltId));
    if (quilt === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.QUILT_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(quilt.itemId);
    await this.provider.deleteQuilt(
      quilt.itemId,
      quilt.quiltId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
