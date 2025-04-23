import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyChairsProvider } from "./MyChairsProvider";
import type { MyChairsParams } from "./schemas/MyChairsParams";
import type { MyChairsRequest } from "./schemas/MyChairsRequest";
import { MyChairsResponse } from "./schemas/MyChairsResponse";

export class MyChairsManager implements IManager {
  public constructor(private readonly provider = new MyChairsProvider()) {}

  public async getMyChairs(payload: TokenPayload): Promise<ManagerResponse<MyChairsResponse[]>> {
    const myChairs = await this.provider.getMyChairs(payload.accountId);
    const responses: MyChairsResponse[] = [];
    for (const myChair of myChairs) {
      const medias = await this.provider.getItemMedias(myChair.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyChairsResponse.fromModel(myChair, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyChairs(
    payload: TokenPayload,
    request: MyChairsRequest,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const myChair = await this.provider.createChair(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyChairsResponse.fromModel(myChair, mediaDatas),
    );
  }

  public async getMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CHAIR_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myChair.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyChairsResponse.fromModel(myChair, mediaDatas),
    );
  }

  public async putMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
    request: MyChairsRequest,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CHAIR_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(myChair.itemId);
    const myUpdatedChair = await this.provider.updateChair(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myChair.chairId,
      myChair.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyChairsResponse.fromModel(myUpdatedChair, mediaDatas),
    );
  }

  public async deleteMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<null>> {
    const myChair = await this.provider.getMyChair(payload.accountId, parseInt(params.chairId));
    if (myChair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.CHAIR_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(myChair.itemId);
    await this.provider.deleteChair(
      myChair.itemId,
      myChair.chairId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
