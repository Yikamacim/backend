import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessViewModel } from "../../../common/models/BusinessViewModel";
import { BusinessMediaProvider } from "../../../common/providers/BusinessMediaProvider";
import { HoursProvider } from "../../../common/providers/HoursProvider";
import { ServiceProvider } from "../../../common/providers/ServiceProvider";
import { BusinessAreaQueries } from "../../../common/queries/BusinessAreaQueries";
import { BusinessViewQueries } from "../../../common/queries/BusinessViewQueries";

export class TopBusinessesProvider implements IProvider {
  public constructor(
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly hoursProvider = new HoursProvider(),
  ) {
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.getActiveServices = this.serviceProvider.getActiveServices.bind(this.serviceProvider);
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
  }

  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;
  public readonly getActiveServices: typeof this.serviceProvider.getActiveServices;
  public readonly getHours: typeof this.hoursProvider.getHours;

  public async getTopBusinessesByArea(
    neighborhoodId: number,
    count: number,
  ): Promise<ProviderResponse<BusinessViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BusinessViewQueries.GET_TOP_BUSINESSES_$BSIDS_$LIMIT,
        [
          (
            await DbConstants.POOL.query(BusinessAreaQueries.GET_BUSINESS_IDS_BY_NEIGHBORHOOD_ID, [
              neighborhoodId,
            ])
          ).rows.map((row: { businessId: number }) => row.businessId),
          count,
        ],
      );
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BusinessViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
