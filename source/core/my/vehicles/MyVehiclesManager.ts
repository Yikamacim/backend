import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
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
      const medias = await this.provider.getItemMedias(myVehicle.itemId);
      const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
      responses.push(MyVehiclesResponse.fromModel(myVehicle, mediaDatas));
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], responses);
  }

  public async postMyVehicles(
    payload: TokenPayload,
    request: MyVehiclesRequest,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
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
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyVehiclesResponse.fromModel(myVehicle, mediaDatas),
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
    const medias = await this.provider.getItemMedias(myVehicle.itemId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyVehiclesResponse.fromModel(myVehicle, mediaDatas),
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
    const findMediasResult = await MediaHelper.findMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const oldMedias = await this.provider.getItemMedias(myVehicle.itemId);
    const myUpdatedVehicle = await this.provider.updateVehicle(
      payload.accountId,
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      myVehicle.vehicleId,
      myVehicle.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.brand,
      request.model,
      request.vehicleType,
    );
    const mediaDatas = await MediaHelper.mediasToMediaDatas(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyVehiclesResponse.fromModel(myUpdatedVehicle, mediaDatas),
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
    const medias = await this.provider.getItemMedias(myVehicle.itemId);
    await this.provider.deleteVehicle(
      myVehicle.itemId,
      myVehicle.vehicleId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
