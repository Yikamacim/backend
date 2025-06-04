import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ReviewEntity } from "../../../../common/entities/ReviewEntity";
import { MyBusinessReviewsProvider } from "./MyBusinessReviewsProvider";
import type { MyBusinessReviewsParams } from "./schemas/MyBusinessReviewsParams";
import type { MyBusinessReviewsRequest } from "./schemas/MyBusinessReviewsRequest";
import { MyBusinessReviewsResponse } from "./schemas/MyBusinessReviewsResponse";

export class MyBusinessReviewsManager implements IManager {
  public constructor(private readonly provider = new MyBusinessReviewsProvider()) {}

  public async getMyBusinessReviews(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessReviewsResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const reviews = await this.provider.getReviewsByBusinessId(business.businessId);
    const entities = reviews.map((review) => new ReviewEntity(review));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessReviewsResponse.fromEntities(entities),
    );
  }

  public async getMyBusinessReviews$(
    payload: TokenPayload,
    params: MyBusinessReviewsParams,
  ): Promise<ManagerResponse<MyBusinessReviewsResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const review = await this.provider.getBusinessReview(
      business.businessId,
      parseInt(params.reviewId),
    );
    if (review === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_REVIEW_WITH_THIS_ID)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessReviewsResponse.fromEntity(new ReviewEntity(review)),
    );
  }

  public async putMyBusinessReviews$(
    payload: TokenPayload,
    params: MyBusinessReviewsParams,
    request: MyBusinessReviewsRequest,
  ): Promise<ManagerResponse<MyBusinessReviewsResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const review = await this.provider.getBusinessReview(
      business.businessId,
      parseInt(params.reviewId),
    );
    if (review === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_REVIEW_WITH_THIS_ID)],
        null,
      );
    }
    if (review.reply !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.REVIEW_IS_ALREADY_REPLIED)],
        null,
      );
    }
    await this.provider.replyReview(review.reviewId, request.message);
    const updatedReview = await this.provider.getBusinessReview(
      business.businessId,
      review.reviewId,
    );
    if (updatedReview === null) {
      throw new UnexpectedDatabaseStateError("Review was not updated");
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessReviewsResponse.fromEntity(new ReviewEntity(updatedReview)),
    );
  }
}
