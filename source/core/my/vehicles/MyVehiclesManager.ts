import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { VehicleEntity } from "../../../common/entities/VehicleEntity";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { ItemMediaRules } from "../../../common/rules/ItemMediaRules";
import { MyVehiclesProvider } from "./MyVehiclesProvider";
import type { MyVehiclesParams } from "./schemas/MyVehiclesParams";
import type { MyVehiclesRequest } from "./schemas/MyVehiclesRequest";
import { MyVehiclesResponse } from "./schemas/MyVehiclesResponse";

export class MyVehiclesManager implements IManager {
  public constructor(private readonly provider = new MyVehiclesProvider()) {}

  public async getMyVehicles(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyVehiclesResponse[]>> {
    const vehicles = await this.provider.getMyActiveVehicles(payload.accountId);
    const entities = await Promise.all(
      vehicles.map(async (myVehicle) => {
        const medias = await this.provider.getItemMedias(myVehicle.itemId);
        const mediaEntities = await MediaHelper.mediasToEntities(medias);
        return new VehicleEntity(myVehicle, mediaEntities);
      }),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyVehiclesResponse.fromEntities(entities),
    );
  }

  public async postMyVehicles(
    payload: TokenPayload,
    request: MyVehiclesRequest,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const findMediasResult = await MediaHelper.findMyMedias(payload.accountId, request.mediaIds);
    if (findMediasResult.isLeft()) {
      return findMediasResult.get();
    }
    const medias = findMediasResult.get();
    const checkMediasResult = await MediaHelper.checkMedias(medias, ItemMediaRules.ALLOWED_TYPES);
    if (checkMediasResult.isLeft()) {
      return checkMediasResult.get();
    }
    const vehicle = await this.provider.createMyVehicle(
      payload.accountId,
      request.name,
      request.description,
      request.mediaIds,
      request.brand,
      request.model,
      request.vehicleType,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyVehiclesResponse.fromEntity(new VehicleEntity(vehicle, mediaEntities)),
    );
  }

  public async getMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const vehicle = await this.provider.getMyActiveVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (vehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(vehicle.itemId);
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyVehiclesResponse.fromEntity(new VehicleEntity(vehicle, mediaEntities)),
    );
  }

  public async putMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
    request: MyVehiclesRequest,
  ): Promise<ManagerResponse<MyVehiclesResponse | null>> {
    const vehicle = await this.provider.getMyActiveVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (vehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
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
    const oldMedias = await this.provider.getItemMedias(vehicle.itemId);
    const updatedVehicle = await this.provider.updateVehicle(
      oldMedias.map((oldMedia) => oldMedia.mediaId),
      vehicle.vehicleId,
      vehicle.itemId,
      request.name,
      request.description,
      request.mediaIds,
      request.brand,
      request.model,
      request.vehicleType,
    );
    const mediaEntities = await MediaHelper.mediasToEntities(medias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyVehiclesResponse.fromEntity(new VehicleEntity(updatedVehicle, mediaEntities)),
    );
  }

  public async deleteMyVehicles$(
    payload: TokenPayload,
    params: MyVehiclesParams,
  ): Promise<ManagerResponse<null>> {
    const vehicle = await this.provider.getMyActiveVehicle(
      payload.accountId,
      parseInt(params.vehicleId),
    );
    if (vehicle === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.VEHICLE_NOT_FOUND)],
        null,
      );
    }
    const medias = await this.provider.getItemMedias(vehicle.itemId);
    await this.provider.archiveItem(
      vehicle.itemId,
      medias.map((media) => media.mediaId),
    );
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
