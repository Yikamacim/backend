import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BedEntity } from "../../../common/entities/BedEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyBedsProvider } from "./MyBedsProvider";
import type { MyBedsParams } from "./schemas/MyBedsParams";
import type { MyBedsRequest } from "./schemas/MyBedsRequest";
import { MyBedsResponse } from "./schemas/MyBedsResponse";

export class MyBedsManager implements IManager {
  public constructor(private readonly provider = new MyBedsProvider()) {}

  public async getMyBeds(payload: TokenPayload): Promise<ManagerResponse<MyBedsResponse[]>> {
    const beds = await this.provider.getMyActiveBeds(payload.accountId);
    const entities = await Promise.all(
      beds.map(async (bed) => {
        const medias = await this.provider.getItemMedias(bed.itemId);
        const mediaEntites = await MediaHelper.mediasToEntities(medias);
        return new BedEntity(bed, mediaEntites);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBedsResponse.fromEntities(entities),
    );
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
    const bed = await this.provider.createMyBed(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedSize,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBedsResponse.fromEntity(new BedEntity(bed, mediaEntities)),
    );
  }

  public async getMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const bed = await this.provider.getMyActiveBed(payload.accountId, parseInt(params.bedId));
    if (bed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(bed.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBedsResponse.fromEntity(new BedEntity(bed, mediaEntities)),
    );
  }

  public async putMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
    request: MyBedsRequest,
  ): Promise<ManagerResponse<MyBedsResponse | null>> {
    const bed = await this.provider.getMyActiveBed(payload.accountId, parseInt(params.bedId));
    if (bed === null) {
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
    const oldMedias = await this.provider.getItemMedias(bed.itemId);
    const updatedBed = await this.provider.updateBed(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      bed.bedId,
      bed.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.bedSize,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBedsResponse.fromEntity(new BedEntity(updatedBed, mediaEntities)),
    );
  }

  public async deleteMyBeds$(
    payload: TokenPayload,
    params: MyBedsParams,
  ): Promise<ManagerResponse<null>> {
    const bed = await this.provider.getMyActiveBed(payload.accountId, parseInt(params.bedId));
    if (bed === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BED_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(bed.itemId);
    await this.provider.archiveItem(
      bed.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
