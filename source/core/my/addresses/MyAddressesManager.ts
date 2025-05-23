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
    const addresses = await this.provider.getMyActiveAddresses(payload.accountId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModels(addresses),
    );
  }

  public async postMyAddresses(
    payload: TokenPayload,
    request: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse>> {
    if (request.isDefault) {
      await this.provider.clearMyDefaultAddresses(payload.accountId);
    }
    if ((await this.provider.getMyActiveAddresses(payload.accountId)).length === 0) {
      request.isDefault = true;
    }
    const address = await this.provider.createMyAddress(
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
      MyAddressesResponse.fromModel(address),
    );
  }

  public async getMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    const address = await this.provider.getMyActiveAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (address === null) {
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
      MyAddressesResponse.fromModel(address),
    );
  }

  public async putMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
    request: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    const address = await this.provider.getMyActiveAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (address === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    if ((await this.provider.getMyActiveAddresses(payload.accountId)).length === 1) {
      request.isDefault = true;
    } else {
      if (request.isDefault) {
        await this.provider.clearMyDefaultAddresses(payload.accountId);
      }
    }
    const updatedAddress = await this.provider.updateAddress(
      address.addressId,
      request.name,
      request.countryId,
      request.provinceId,
      request.districtId,
      request.neighborhoodId,
      request.explicitAddress,
      request.isDefault,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModel(updatedAddress),
    );
  }

  public async deleteMyAddresses$(
    payload: TokenPayload,
    params: MyAddressesParams,
  ): Promise<ManagerResponse<null>> {
    const address = await this.provider.getMyActiveAddress(
      payload.accountId,
      parseInt(params.addressId),
    );
    if (address === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    if (address.isDefault) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS)],
        null,
      );
    }
    await this.provider.archiveAddress(address.addressId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
