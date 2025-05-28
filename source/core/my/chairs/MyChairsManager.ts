import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ChairEntity } from "../../../common/entities/ChairEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyChairsProvider } from "./MyChairsProvider";
import type { MyChairsParams } from "./schemas/MyChairsParams";
import type { MyChairsRequest } from "./schemas/MyChairsRequest";
import { MyChairsResponse } from "./schemas/MyChairsResponse";

export class MyChairsManager implements IManager {
  public constructor(private readonly provider = new MyChairsProvider()) {}

  public async getMyChairs(payload: TokenPayload): Promise<ManagerResponse<MyChairsResponse[]>> {
    const chairs = await this.provider.getMyActiveChairs(payload.accountId);
    const entities = await Promise.all(
      chairs.map(async (chair) => {
        const medias = await this.provider.getItemMedias(chair.itemId);
        const mediaEntities = await MediaHelper.mediasToEntities(medias);
        return new ChairEntity(chair, mediaEntities);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyChairsResponse.fromEntities(entities),
    );
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
    const chair = await this.provider.createMyChair(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyChairsResponse.fromEntity(new ChairEntity(chair, mediaEntities)),
    );
  }

  public async getMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const chair = await this.provider.getMyActiveChair(payload.accountId, parseInt(params.chairId));
    if (chair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(chair.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyChairsResponse.fromEntity(new ChairEntity(chair, mediaEntities)),
    );
  }

  public async putMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
    request: MyChairsRequest,
  ): Promise<ManagerResponse<MyChairsResponse | null>> {
    const chair = await this.provider.getMyActiveChair(payload.accountId, parseInt(params.chairId));
    if (chair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID)],
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
    const oldMedias = await this.provider.getItemMedias(chair.itemId);
    const updatedChair = await this.provider.updateChair(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      chair.chairId,
      chair.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.quantity,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyChairsResponse.fromEntity(new ChairEntity(updatedChair, mediaEntities)),
    );
  }

  public async deleteMyChairs$(
    payload: TokenPayload,
    params: MyChairsParams,
  ): Promise<ManagerResponse<null>> {
    const chair = await this.provider.getMyActiveChair(payload.accountId, parseInt(params.chairId));
    if (chair === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(chair.itemId);
    await this.provider.archiveItem(
      chair.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
