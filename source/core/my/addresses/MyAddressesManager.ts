import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MyAddressesProvider } from "./MyAddressesProvider";
import type { MyAddressesRequest } from "./schemas/MyAddressesRequest";
import { MyAddressesResponse } from "./schemas/MyAddressesResponse";

export class MyAddressesManager implements IManager {
  public constructor(private readonly provider = new MyAddressesProvider()) {}

  public async getMyAddresses(accountId: number): Promise<ManagerResponse<MyAddressesResponse[]>> {
    // Get my addresses
    const prGetMyAddresses = await this.provider.getMyAddresses(accountId);
    // Return
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModels(prGetMyAddresses.data),
    );
  }

  public async postMyAddresses(
    accountId: number,
    validatedData: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse>> {
    // Clear default address if new address is set as default
    if (validatedData.isDefault) {
      await this.provider.clearMyDefaultAddresses(accountId);
    }
    // Create my address
    const prCreateAddress = await this.provider.createAddress(
      accountId,
      validatedData.name,
      validatedData.countryId,
      validatedData.provinceId,
      validatedData.districtId,
      validatedData.neighborhoodId,
      validatedData.explicitAddress,
      validatedData.isDefault,
    );
    // Get the created address
    const prGetCreatedAddress = await this.provider.getMyAddress(
      accountId,
      prCreateAddress.data.addressId,
    );
    if (prGetCreatedAddress.data === null) {
      throw new UnexpectedDatabaseStateError("Address was not created");
    }
    // Return the created address
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyAddressesResponse.fromModel(prGetCreatedAddress.data),
    );
  }

  public async getMyAddresses$addressId(
    accountId: number,
    addressId: number,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    // Try to get my address
    const prGetMyAddress = await this.provider.getMyAddress(accountId, addressId);
    // Check if address exists
    if (prGetMyAddress.data === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    // Return my address
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModel(prGetMyAddress.data),
    );
  }

  public async putMyAddresses$addressId(
    accountId: number,
    addressId: number,
    validatedData: MyAddressesRequest,
  ): Promise<ManagerResponse<MyAddressesResponse | null>> {
    // Try to get my address
    const prGetMyAddress = await this.provider.getMyAddress(accountId, addressId);
    // Check if address exists
    if (prGetMyAddress.data === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    // Clear default address if new address is set as default
    if (validatedData.isDefault) {
      await this.provider.clearMyDefaultAddresses(accountId);
    }
    // Update my address
    const prUpdateAddress = await this.provider.updateAddress(
      addressId,
      validatedData.name,
      validatedData.countryId,
      validatedData.provinceId,
      validatedData.districtId,
      validatedData.neighborhoodId,
      validatedData.explicitAddress,
      validatedData.isDefault,
    );
    if (prUpdateAddress.data === null) {
      throw new UnexpectedDatabaseStateError("Address was not updated");
    }
    // Get updated address
    const prGetUpdatedAddress = await this.provider.getMyAddress(
      accountId,
      prUpdateAddress.data.addressId,
    );
    if (prGetUpdatedAddress.data === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    // Return updated address
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyAddressesResponse.fromModel(prGetUpdatedAddress.data),
    );
  }

  public async deleteMyAddresses$addressId(
    accountId: number,
    addressId: number,
  ): Promise<ManagerResponse<null>> {
    // Try to get my address
    const prGetMyAddress = await this.provider.getMyAddress(accountId, addressId);
    if (prGetMyAddress.data === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ADDRESS_NOT_FOUND)],
        null,
      );
    }
    // Check if address is default
    if (prGetMyAddress.data.isDefault) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS)],
        null,
      );
    }
    // Delete my address
    await this.provider.deleteAddress(addressId);
    // Return success
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }
}
