import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyBedsProvider } from "./MyBedsProvider";
import type { MyBedsParams } from "./schemas/MyBedsParams";
import type { MyBedsRequest } from "./schemas/MyBedsRequest";
import { MyBedsResponse } from "./schemas/MyBedsResponse";

export class MyBedsManager implements IManager {
  public constructor(private readonly provider = new MyBedsProvider()) {}

  public async getMyBeds(payload: TokenPayload): Promise<ManagerResponse<MyBedsResponse[]>> {
    const myBeds = await this.provider.getMyBeds(payload.accountId);
    const responses: MyBedsResponse[] = [];
    for (const myBed of myBeds) {
      const medias = await this.provider.getItemMedias(myBed.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyBedsResponse.fromModel(myBed, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyBeds(
    payload: TokenPayload,
    request: MyBedsRequest,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const myBed = await this.provider.createBed(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedSize,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBedsResponse.fromModel(myBed, mediaDatas),
    );
  }

  public async getMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myBed.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBedsResponse.fromModel(myBed, mediaDatas),
    );
  }

  public async putMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
    request: MyBedsRequest,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(myBed.itemId);
    const myUpdatedBed = await this.provider.updateBed(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myBed.bedId,
      myBed.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedSize,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBedsResponse.fromModel(myUpdatedBed, mediaDatas),
    );
  }

  public async deleteMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<null>> {
    const myBed = await this.provider.getMyBed(payload.accountId, parseInt(params.bedId));
    if (myBed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myBed.itemId);
    await this.provider.deleteBed(
      myBed.itemId,
      myBed.bedId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
