import type { ProviderResponse } from "../../../../@types/responses";
import { BusinessConstants } from "../../../../app/constants/BusinessConstants";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessModel } from "../../../../common/models/BusinessModel";
import { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import { AddressProvider } from "../../../../common/providers/AddressProvider";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { BusinessQueries } from "../../../../common/queries/BusinessQueries";

export class MyBusinessProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly addressProvider = new AddressProvider(),
    private readonly mediaProvider = new MediaProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
  ) {
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.partialGetMyBusiness = this.businessProvider.partialGetMyBusiness.bind(
      this.businessProvider,
    );
    this.createAddress = this.addressProvider.createAddress.bind(this.addressProvider);
    this.updateAddress = this.addressProvider.updateAddress.bind(this.addressProvider);
    this.partialCreateBusinessMedia = this.businessMediaProvider.partialCreateBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialDeleteBusinessMainMedia =
      this.businessMediaProvider.partialDeleteBusinessMainMedia.bind(this.businessMediaProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;

  private readonly partialGetMyBusiness: typeof this.businessProvider.partialGetMyBusiness;
  private readonly createAddress: typeof this.addressProvider.createAddress;
  private readonly updateAddress: typeof this.addressProvider.updateAddress;
  private readonly partialCreateBusinessMedia: typeof this.businessMediaProvider.partialCreateBusinessMedia;
  private readonly partialDeleteBusinessMainMedia: typeof this.businessMediaProvider.partialDeleteBusinessMainMedia;

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
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
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
      if (mediaId !== null) {
        await this.partialCreateBusinessMedia(businessView.businessId, mediaId, true);
      }
      return await ResponseUtil.providerResponse(businessView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
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
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
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
      if (mediaId !== null) {
        await this.partialDeleteBusinessMainMedia(businessView.businessId);
        await this.partialCreateBusinessMedia(businessView.businessId, mediaId, true);
      }
      return await ResponseUtil.providerResponse(businessView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

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
