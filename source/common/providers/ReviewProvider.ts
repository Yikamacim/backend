import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ReviewViewModel } from "../models/ReviewViewModel";
import { ReviewViewQueries } from "../queries/ReviewViewQueries";

export class ReviewProvider implements IProvider {
  public async getReviewsByBusinessId(
    businessId: number,
  ): Promise<ProviderResponse<ReviewViewModel[]>> {
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
