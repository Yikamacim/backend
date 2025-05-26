import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { HoursProvider } from "../../../../common/providers/HoursProvider";
import { ServiceProvider } from "../../../../common/providers/ServiceProvider";
import { BusinessQueries } from "../../../../common/queries/BusinessQueries";

export class MyBusinessCloseProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly hoursProvider = new HoursProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.getActiveServices = this.serviceProvider.getActiveServices.bind(this.serviceProvider);
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
    this.partialGetBusiness = this.businessProvider.partialGetBusiness.bind(this.businessProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;

  public readonly getActiveServices: typeof this.serviceProvider.getActiveServices;
  public readonly getHours: typeof this.hoursProvider.getHours;

  private readonly partialGetBusiness: typeof this.businessProvider.partialGetBusiness;

  public async closeBusiness(businessId: number): Promise<ProviderResponse<BusinessViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialCloseBusiness(businessId);
      const businessView = await this.partialGetBusiness(businessId);
      if (businessView === null) {
        throw new UnexpectedDatabaseStateError("Business was not updated");
      }
      return await ResponseUtil.providerResponse(businessView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCloseBusiness(businessId: number): Promise<void> {
    await DbConstants.POOL.query(BusinessQueries.UPDATE_BUSINESS_$BSID_$ISOP, [businessId, false]);
  }
}
