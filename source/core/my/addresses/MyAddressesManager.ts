import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MyAddressesProvider } from "./MyAddressesProvider";
import type { MyAddressesParams } from "./schemas/MyAddressesParams";
import type { MyAddressesRequest } from "./schemas/MyAddressesRequest";
import { MyAddressesResponse } from "./schemas/MyAddressesResponse";

export class MyAddressesManager implements IManager {
  public constructor(private readonly provider = new MyAddressesProvider()) {}

  public async getMyAddresses(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyAddressesResponse[]>> {
    const myAddresses = await this.provider.getMyAddresses(payload.accountId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModels(myAddresses),
    );
  }

  public async postMyAddresses(
    payload: TokenPayload,
    request: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse>> {
    if (request.isDefault) {
      await this.provider.clearMyDefaultAddresses(payload.accountId);
    }
    const myAddress = await this.provider.createAddress(
      payload.accountId,
      request.name,
      request.countryId,
      request.provinceId,
      request.districtId,
      request.neighborhoodId,
      request.explicitAddress,
      request.isDefault,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyAddressesResponse.fromModel(myAddress),
    );
  }

  public async getMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    const myAddress = await this.provider.getMyAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (myAddress === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModel(myAddress),
    );
  }

  public async putMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
    request: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    const myAddress = await this.provider.getMyAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (myAddress === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    if (request.isDefault) {
      await this.provider.clearMyDefaultAddresses(payload.accountId);
    }
    const myUpdatedAddress = await this.provider.updateAddress(
      myAddress.addressId,
      request.name,
      request.countryId,
      request.provinceId,
      request.districtId,
      request.neighborhoodId,
      request.explicitAddress,
      request.isDefault,
    );
    if (myUpdatedAddress === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModel(myUpdatedAddress),
    );
  }

  public async deleteMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
  ): Promise<ManagerResponse<null>> {
    const myAddress = await this.provider.getMyAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (myAddress === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    if (myAddress.isDefault) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS)],
        null,
      );
    }
    await this.provider.deleteAddress(myAddress.addressId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
