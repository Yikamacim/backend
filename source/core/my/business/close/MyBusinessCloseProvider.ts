import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessViewModel } from "../../../../common/models/BusinessViewModel";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BusinessQueries } from "../../../../common/queries/BusinessQueries";

export class MyBusinessCloseProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
  ) {
    this.getBusinessByAccountId = this.businessProvider.getBusinessByAccountId.bind(
      this.businessProvider,
    );
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialGetBusinessByAccountId = this.businessProvider.partialGetBusinessByAccountId.bind(
      this.businessProvider,
    );
  }

  public readonly getBusinessByAccountId: typeof this.businessProvider.getBusinessByAccountId;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;

  private readonly partialGetBusinessByAccountId: typeof this.businessProvider.partialGetBusinessByAccountId;

  public async closeBusiness(
    accountId: number,
    businessId: number,
  ): Promise<ProviderResponse<BusinessViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialCloseBusiness(businessId);
      const businessView = await this.partialGetBusinessByAccountId(accountId);
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
