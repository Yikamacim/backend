import type { ProviderResponse } from "../../../../@types/responses";
import { BusinessConstants } from "../../../../app/constants/BusinessConstants";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessModel } from "../../../../common/models/BusinessModel";
import { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import { AddressProvider } from "../../../../common/providers/AddressProvider";
import { ApprovalProvider } from "../../../../common/providers/ApprovalProvider";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BusinessQueries } from "../../../../common/queries/BusinessQueries";

export class MyBusinessProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly addressProvider = new AddressProvider(),
    private readonly approvalProvider = new ApprovalProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.getApproval = this.approvalProvider.getApproval.bind(this.approvalProvider);
    this.updateApproval = this.approvalProvider.updateApproval.bind(this.approvalProvider);
    this.partialGetBusiness = this.businessProvider.partialGetBusiness.bind(this.businessProvider);
    this.createMyAddress = this.addressProvider.createMyAddress.bind(this.addressProvider);
    this.updateAddress = this.addressProvider.updateAddress.bind(this.addressProvider);
    this.partialCreateBusinessMedia = this.businessMediaProvider.partialCreateBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialDeleteBusinessMainMedia =
      this.businessMediaProvider.partialDeleteBusinessMainMedia.bind(this.businessMediaProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;
  public readonly getApproval: typeof this.approvalProvider.getApproval;
  public readonly updateApproval: typeof this.approvalProvider.updateApproval;

  private readonly partialGetBusiness: typeof this.businessProvider.partialGetBusiness;
  private readonly createMyAddress: typeof this.addressProvider.createMyAddress;
  private readonly updateAddress: typeof this.addressProvider.updateAddress;
  private readonly partialCreateBusinessMedia: typeof this.businessMediaProvider.partialCreateBusinessMedia;
  private readonly partialDeleteBusinessMainMedia: typeof this.businessMediaProvider.partialDeleteBusinessMainMedia;

  public async createMyBusiness(
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
        await this.createMyAddress(
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
      const business = await this.partialCreateMyBusiness(
        accountId,
        name,
        addressId,
        phone,
        email,
        description,
      );
      const businessView = await this.partialGetBusiness(business.businessId);
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
    businessId: number,
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
      await this.partialUpdateBusiness(businessId, name, addressId, phone, email, description);
      const businessView = await this.partialGetBusiness(businessId);
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

  private async partialCreateMyBusiness(
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
    businessId: number,
    name: string,
    addressId: number,
    phone: string,
    email: string,
    description: string,
  ): Promise<BusinessModel> {
    const results = await DbConstants.POOL.query(
      BusinessQueries.UPDATE_BUSINESS_RT_$BSID_$NAME_$ADID_$PHONE_$EMAIL_$DESC,
      [businessId, name, addressId, phone, email, description],
    );
    const record: unknown = results.rows[0];
    return BusinessModel.fromRecord(record);
  }
}
