import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { BusinessServiceViewModel } from "../../common/models/BusinessServiceViewModel";
import { BusinessMediaProvider } from "../../common/providers/BusinessMediaProvider";
import { BusinessAreaQueries } from "../../common/queries/BusinessAreaQueries";
import { BusinessServiceViewQueries } from "../../common/queries/BusinessServiceViewQueries";

export class SearchProvider implements IProvider {
  public constructor(private readonly businessMediaProvider = new BusinessMediaProvider()) {
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
  }

  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;

  public async searchBusinesses(
    neighborhoodId: number,
    query: string,
  ): Promise<ProviderResponse<BusinessServiceViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BusinessServiceViewQueries.SEARCH_BUSINESSES_$BSIDS_$QUERY,
        [
          (
            await DbConstants.POOL.query(BusinessAreaQueries.GET_BUSINESS_IDS_BY_NEIGHBORHOOD_ID, [
              neighborhoodId,
            ])
          ).rows.map((row: { business_id: number }) => row.business_id),
          query,
        ],
      );
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BusinessServiceViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
