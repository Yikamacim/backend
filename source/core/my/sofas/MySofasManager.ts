import type { MediaData } from "../../../@types/medias";
import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { FileUtil } from "../../../app/utils/FileUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaModel } from "../../../common/models/MediaModel";
import { BucketModule } from "../../../modules/bucket/module";
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
      const mySofaMedias = await this.provider.getItemMedias(mySofa.itemId);
      const mySofaMediasData: MediaData[] = [];
      for (const mySofaMedia of mySofaMedias) {
        mySofaMediasData.push({
          mediaId: mySofaMedia.mediaId,
          mediaType: mySofaMedia.mediaType,
          extension: mySofaMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(mySofaMedia.mediaId.toString(), mySofaMedia.extension),
          ),
        });
      }
      responses.push(MySofasResponse.fromModel(mySofa, mySofaMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMySofas(
    payload: TokenPayload,
    request: MySofasRequest,
  ): Promise<ManagerResponse<MySofasResponse | null>> {
    const myMedias = await this.provider.getMyMedias(payload.accountId);
    const medias: MediaModel[] = [];
    for (const mediaId of request.mediaIds) {
      const myMedia = myMedias.find((myMedia) => myMedia.mediaId === mediaId);
      if (myMedia === undefined) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      medias.push(myMedia);
    }
    for (const media of medias) {
      if (
        !(await BucketModule.instance.checkFileExists(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ))
      ) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
          null,
        );
      }
    }
    const mySofa = await this.provider.createSofa(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.sofaType,
    );
    const mediaData: MediaData[] = [];
    for (const media of medias) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MySofasResponse.fromModel(mySofa, mediaData),
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
    const mySofaMedias = await this.provider.getItemMedias(mySofa.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of mySofaMedias) {
      mediaData.push({
        mediaId: itemMedia.mediaId,
        mediaType: itemMedia.mediaType,
        extension: itemMedia.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(itemMedia.mediaId.toString(), itemMedia.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySofasResponse.fromModel(mySofa, mediaData),
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
    const myMedias = await this.provider.getMyMedias(payload.accountId);
    const medias: MediaModel[] = [];
    for (const mediaId of request.mediaIds) {
      const myMedia = myMedias.find((myMedia) => myMedia.mediaId === mediaId);
      if (myMedia === undefined) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
          null,
        );
      }
      medias.push(myMedia);
    }
    for (const media of medias) {
      if (
        !(await BucketModule.instance.checkFileExists(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ))
      ) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.MEDIA_NOT_UPLOADED)],
          null,
        );
      }
    }
    const mySofaMedias = await this.provider.getItemMedias(mySofa.itemId);
    const myUpdatedSofa = await this.provider.updateSofa(
      payload.accountId,
      mySofaMedias.map((itemMedia) => itemMedia.mediaId),
      mySofa.sofaId,
      mySofa.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.sofaType,
    );
    const mediaData: MediaData[] = [];
    for (const media of medias) {
      mediaData.push({
        mediaId: media.mediaId,
        mediaType: media.mediaType,
        extension: media.extension,
        url: await BucketModule.instance.getAccessUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
        ),
      });
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MySofasResponse.fromModel(myUpdatedSofa, mediaData),
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
    const mySofaMedias = await this.provider.getItemMedias(mySofa.itemId);
    await this.provider.deleteSofa(
      mySofa.itemId,
      mySofa.sofaId,
      mySofaMedias.map((mySofaMedia) => mySofaMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
