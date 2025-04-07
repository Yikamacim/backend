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
import { MyVehiclesProvider } from "./MyVehiclesProvider";
import type { MyVehiclesParams } from "./schemas/MyVehiclesParams";
import type { MyVehiclesRequest } from "./schemas/MyVehiclesRequest";
import { MyVehiclesResponse } from "./schemas/MyVehiclesResponse";

export class MyVehiclesManager implements IManager {
  public constructor(private readonly provider = new MyVehiclesProvider()) {}

  public async getMyVehicles(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyVehiclesResponse[]>> {
    const myVehicles = await this.provider.getMyVehicles(payload.accountId);
    const responses: MyVehiclesResponse[] = [];
    for (const myVehicle of myVehicles) {
      const myVehicleMedias = await this.provider.getItemMedias(myVehicle.itemId);
      const myVehicleMediasData: MediaData[] = [];
      for (const myVehicleMedia of myVehicleMedias) {
        myVehicleMediasData.push({
          mediaId: myVehicleMedia.mediaId,
          mediaType: myVehicleMedia.mediaType,
          extension: myVehicleMedia.extension,
          url: await BucketModule.instance.getAccessUrl(
            FileUtil.getName(myVehicleMedia.mediaId.toString(), myVehicleMedia.extension),
          ),
        });
      }
      responses.push(MyVehiclesResponse.fromModel(myVehicle, myVehicleMediasData));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyVehicles(
    payload: TokenPayload,
    request: MyVehiclesRequest,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
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
    const myVehicle = await this.provider.createVehicle(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.brand,
      request.model,
      request.vehicleType,
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
      MyVehiclesResponse.fromModel(myVehicle, mediaData),
    );
  }

  public async getMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const myVehicle = await this.provider.getMyVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (myVehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
        null,
      );
    }
    const itemMedias = await this.provider.getItemMedias(myVehicle.itemId);
    const mediaData: MediaData[] = [];
    for (const itemMedia of itemMedias) {
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
      MyVehiclesResponse.fromModel(myVehicle, mediaData),
    );
  }

  public async putMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
    request: MyVehiclesRequest,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const myVehicle = await this.provider.getMyVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (myVehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
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
    const itemMedias = await this.provider.getItemMedias(myVehicle.itemId);
    const myUpdatedVehicle = await this.provider.updateVehicle(
      payload.accountId,
      itemMedias.map((itemMedia) => itemMedia.mediaId),
      myVehicle.vehicleId,
      myVehicle.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.brand,
      request.model,
      request.vehicleType,
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
      MyVehiclesResponse.fromModel(myUpdatedVehicle, mediaData),
    );
  }

  public async deleteMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
  ): Promise<ManagerResponse<null>> {
    const myVehicle = await this.provider.getMyVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (myVehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
        null,
      );
    }
    const myVehicleMedias = await this.provider.getItemMedias(myVehicle.itemId);
    await this.provider.deleteVehicle(
      myVehicle.itemId,
      myVehicle.vehicleId,
      myVehicleMedias.map((myVehicleMedia) => myVehicleMedia.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }
}
