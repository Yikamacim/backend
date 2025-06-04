import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ReviewViewModel } from "../../../../common/models/ReviewViewModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { ReviewProvider } from "../../../../common/providers/ReviewProvider";
import { ReplyQueries } from "../../../../common/queries/ReplyQueries";
import { ReviewViewQueries } from "../../../../common/queries/ReviewViewQueries";

export class MyBusinessReviewsProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly reviewProvider = new ReviewProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getReviewsByBusinessId = this.reviewProvider.getReviewsByBusinessId.bind(
      this.reviewProvider,
    );
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getReviewsByBusinessId: typeof this.reviewProvider.getReviewsByBusinessId;

  public async getBusinessReview(
    businessId: number,
    reviewId: number,
  ): Promise<ProviderResponse<ReviewViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ReviewViewQueries.GET_REVIEW_$BSID_$RVID, [
        businessId,
        reviewId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(ReviewViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async replyReview(reviewId: number, message: string): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(ReplyQueries.INSERT_REPLY_$RVID_$MSG, [reviewId, message]);
      return ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
