import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ReviewModel } from "../../../../common/models/ReviewModel";
import { ReviewViewModel } from "../../../../common/models/ReviewViewModel";
import { OrderProvider } from "../../../../common/providers/OrderProvider";
import { ReviewQueries } from "../../../../common/queries/ReviewQueries";
import { ReviewViewQueries } from "../../../../common/queries/ReviewViewQueries";

export class MyOrdersReviewProvider implements IProvider {
  public constructor(private readonly orderProvider = new OrderProvider()) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;

  public async getReviewByOrderId(
    orderId: number,
  ): Promise<ProviderResponse<ReviewViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ReviewViewQueries.GET_REVIEW_$ORID, [orderId]);
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

  public async createMyReview(
    accountId: number,
    businessId: number,
    orderId: number,
    stars: number,
    comment: string,
  ): Promise<ProviderResponse<ReviewViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const review = await this.partialCreateReview(accountId, businessId, orderId, stars, comment);
      const reviewView = await this.partialGetReview(review.reviewId);
      if (reviewView === null) {
        throw new UnexpectedDatabaseStateError("Review was not created");
      }
      return await ResponseUtil.providerResponse(reviewView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetReview(reviewId: number): Promise<ReviewViewModel | null> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    const results = await DbConstants.POOL.query(ReviewViewQueries.GET_REVIEW_$RVID, [reviewId]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return ReviewViewModel.fromRecord(record);
  }

  private async partialCreateReview(
    accountId: number,
    businessId: number,
    orderId: number,
    stars: number,
    comment: string,
  ): Promise<ReviewModel> {
    const results = await DbConstants.POOL.query(
      ReviewQueries.INSERT_REVIEW_RT_$ACID_$BSID_$ORID_$STARS_$CMNT,
      [accountId, businessId, orderId, stars, comment],
    );
    const record: unknown = results.rows[0];
    return ReviewModel.fromRecord(record);
  }
}
