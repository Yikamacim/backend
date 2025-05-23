import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import { ApprovalProvider } from "../../../../common/providers/ApprovalProvider";
import { BankAccountProvider } from "../../../../common/providers/BankAccountProvider";
import { BusinessAreaProvider } from "../../../../common/providers/BusinessAreaProvider";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { HoursProvider } from "../../../../common/providers/HoursProvider";
import { ServiceProvider } from "../../../../common/providers/ServiceProvider";
import { BusinessQueries } from "../../../../common/queries/BusinessQueries";

export class MyBusinessOpenProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly approvalProvider = new ApprovalProvider(),
    private readonly bankAccountProvider = new BankAccountProvider(),
    private readonly businessAreaProvider = new BusinessAreaProvider(),
    private readonly hoursProvider = new HoursProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getApproval = this.approvalProvider.getApproval.bind(this.approvalProvider);
    this.getBankAccount = this.bankAccountProvider.getBankAccount.bind(this.bankAccountProvider);
    this.getBusinessAreas = this.businessAreaProvider.getBusinessAreas.bind(
      this.businessAreaProvider,
    );
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
    this.getActiveServices = this.serviceProvider.getActiveServices.bind(this.serviceProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialGetBusiness = this.businessProvider.partialGetBusiness.bind(this.businessProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getApproval: typeof this.approvalProvider.getApproval;
  public readonly getBankAccount: typeof this.bankAccountProvider.getBankAccount;
  public readonly getBusinessAreas: typeof this.businessAreaProvider.getBusinessAreas;
  public readonly getHours: typeof this.hoursProvider.getHours;
  public readonly getActiveServices: typeof this.serviceProvider.getActiveServices;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;

  private readonly partialGetBusiness: typeof this.businessProvider.partialGetBusiness;

  public async openBusiness(businessId: number): Promise<ProviderResponse<BusinessViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialOpenBusiness(businessId);
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

  private async partialOpenBusiness(businessId: number): Promise<void> {
    await DbConstants.POOL.query(BusinessQueries.UPDATE_BUSINESS_$BSID_$ISOP, [businessId, true]);
  }
}
