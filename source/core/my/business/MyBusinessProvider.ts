import type { ProviderResponse } from "../../../@types/responses";
import { BusinessConstants } from "../../../app/constants/BusinessConstants";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessModel } from "../../../common/models/BusinessModel";
import { BusinessViewModel } from "../../../common/models/BusinessViewModel";
import { AddressProvider } from "../../../common/providers/AddressProvider";
import { BusinessMediaProvider } from "../../../common/providers/BusinessMediaProvider";
import { BusinessQueries } from "../../../common/queries/BusinessQueries";
import { BusinessViewQueries } from "../../../common/queries/BusinessViewQueries";

export class MyBusinessProvider implements IProvider {
  public constructor(
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly addressProvider = new AddressProvider(),
  ) {
    this.partialCreateBusinessMedia = this.businessMediaProvider.partialCreateBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialDeleteBusinessMainMedia =
      this.businessMediaProvider.partialDeleteBusinessMainMedia.bind(this.businessMediaProvider);
    this.createAddress = this.addressProvider.createAddress.bind(this.addressProvider);
    this.updateAddress = this.addressProvider.updateAddress.bind(this.addressProvider);
    this.deleteAddress = this.addressProvider.deleteAddress.bind(this.addressProvider);
  }

  public partialCreateBusinessMedia: typeof this.businessMediaProvider.partialCreateBusinessMedia;
  public partialDeleteBusinessMainMedia: typeof this.businessMediaProvider.partialDeleteBusinessMainMedia;
  public createAddress: typeof this.addressProvider.createAddress;
  public updateAddress: typeof this.addressProvider.updateAddress;
  public deleteAddress: typeof this.addressProvider.deleteAddress;

  public async getMyBusiness(
    accountId: number,
  ): Promise<ProviderResponse<BusinessViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyBusiness(accountId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBusiness(
    accountId: number,
    name: string,
    mediaId: number | null,
    address: {
      readonly countryId: number;
      readonly provinceId: number;
      readonly districtId: number;
      readonly neighborhoodId: number;
      readonly explicitAddress: string;
    },
    phone: string,
    email: string,
    description: string,
  ): Promise<ProviderResponse<BusinessViewModel>> {
    if (mediaId !== null) {
      await this.partialCreateBusinessMedia(accountId, mediaId, true);
    }
    const addressId = (
      await this.createAddress(
        accountId,
        BusinessConstants.ADDRESS_NAME,
        address.countryId,
        address.provinceId,
        address.districtId,
        address.neighborhoodId,
        address.explicitAddress,
        BusinessConstants.ADDRESS_IS_DEFAULT,
      )
    ).addressId;
    await this.partialCreateBusiness(accountId, name, addressId, phone, email, description);
    const businessView = await this.partialGetMyBusiness(accountId);
    if (businessView === null) {
      throw new UnexpectedDatabaseStateError("Business was not created");
    }
    return await ResponseUtil.providerResponse(businessView);
  }

  public async updateBusiness(
    accountId: number,
    name: string,
    mediaId: number | null,
    addressId: number,
    address: {
      readonly countryId: number;
      readonly provinceId: number;
      readonly districtId: number;
      readonly neighborhoodId: number;
      readonly explicitAddress: string;
    },
    phone: string,
    email: string,
    description: string,
  ): Promise<ProviderResponse<BusinessViewModel>> {
    if (mediaId !== null) {
      await this.partialDeleteBusinessMainMedia(accountId);
      await this.partialCreateBusinessMedia(accountId, mediaId, true);
    }
    await this.updateAddress(
      addressId,
      BusinessConstants.ADDRESS_NAME,
      address.countryId,
      address.provinceId,
      address.districtId,
      address.neighborhoodId,
      address.explicitAddress,
      BusinessConstants.ADDRESS_IS_DEFAULT,
    );
    await this.partialUpdateBusiness(accountId, name, addressId, phone, email, description);
    const businessView = await this.partialGetMyBusiness(accountId);
    if (businessView === null) {
      throw new UnexpectedDatabaseStateError("Business was not created");
    }
    return await ResponseUtil.providerResponse(businessView);
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyBusiness(accountId: number): Promise<BusinessViewModel | null> {
    const results = await DbConstants.POOL.query(BusinessViewQueries.GET_BUSINESS_$ACID, [
      accountId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return await ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(BusinessViewModel.fromRecord(record));
  }

  private async partialCreateBusiness(
    accountId: number,
    name: string,
    addressId: number,
    phone: string,
    email: string,
    description: string,
  ): Promise<BusinessModel> {
    const results = await DbConstants.POOL.query(
      BusinessQueries.INSERT_BUSINESS_RT_$ACID_$NAME_$ADID_$PHONE_$EMAIL_$DESC,
      [accountId, name, addressId, phone, email, description],
    );
    const record: unknown = results.rows[0];
    return BusinessModel.fromRecord(record);
  }

  private async partialUpdateBusiness(
    accountId: number,
    name: string,
    addressId: number,
    phone: string,
    email: string,
    description: string,
  ): Promise<BusinessModel> {
    const results = await DbConstants.POOL.query(
      BusinessQueries.UPDATE_BUSINESS_RT_$ACID_$NAME_$ADID_$PHONE_$EMAIL_$DESC,
      [accountId, name, addressId, phone, email, description],
    );
    const record: unknown = results.rows[0];
    return BusinessModel.fromRecord(record);
  }
}
