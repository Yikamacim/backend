import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ReviewViewModel } from "../../../common/models/ReviewViewModel";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { ReviewViewQueries } from "../../../common/queries/ReviewViewQueries";

export class BusinessesReviewsProvider implements IProvider {
  public constructor(private readonly businessProvider = new BusinessProvider()) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;

  public async getReviews(businessId: number): Promise<ProviderResponse<ReviewViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ReviewViewQueries.GET_REVIEWS_$BSID, [
        businessId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ReviewViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
