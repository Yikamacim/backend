import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessAreaViewModel } from "../../../../common/models/BusinessAreaViewModel";
import { BusinessAreaProvider } from "../../../../common/providers/BusinessAreaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BusinessAreaQueries } from "../../../../common/queries/BusinessAreaQueries";
import { BusinessAreaViewQueries } from "../../../../common/queries/BusinessAreaViewQueries";

export class MyBusinessAreasProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    public readonly businessAreaProvider = new BusinessAreaProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getBusinessAreas = this.businessAreaProvider.getBusinessAreas.bind(
      this.businessAreaProvider,
    );
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getBusinessAreas: typeof this.businessAreaProvider.getBusinessAreas;

  public async createBusinessArea(
    businessId: number,
    neighborhoodId: number,
  ): Promise<ProviderResponse<BusinessAreaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialCreateBusinessArea(businessId, neighborhoodId);
      const area = await this.partialGetBusinessArea(businessId, neighborhoodId);
      if (area === null) {
        throw new UnexpectedDatabaseStateError("Business area was not created");
      }
      return await ResponseUtil.providerResponse(area);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteBusinessArea(
    businessId: number,
    neighborhoodId: number,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(BusinessAreaQueries.DELETE_BUSINESS_AREA_$BSID_$NBID, [
        businessId,
        neighborhoodId,
      ]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialGetBusinessArea(
    businessId: number,
    neighborhoodId: number,
  ): Promise<BusinessAreaViewModel | null> {
    const results = await DbConstants.POOL.query(
      BusinessAreaViewQueries.GET_BUSINESS_AREA_$BSID_$NBID,
      [businessId, neighborhoodId],
    );
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return await ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(BusinessAreaViewModel.fromRecord(record));
  }

  public async partialCreateBusinessArea(
    businessId: number,
    neighborhoodId: number,
  ): Promise<void> {
    await DbConstants.POOL.query(BusinessAreaQueries.INSERT_BUSINESS_AREA_$BSID_$NBID, [
      businessId,
      neighborhoodId,
    ]);
  }
}
