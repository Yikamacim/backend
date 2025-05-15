import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessesReviewsProvider } from "./BusinessesReviewsProvider";
import type { BusinessesReviewsParams } from "./schemas/BusinessesReviewsParams";
import { BusinessesReviewsResponse } from "./schemas/BusinessesReviewsResponse";

export class BusinessesReviewsManager implements IManager {
  public constructor(private readonly provider = new BusinessesReviewsProvider()) {}

  public async getBusinessesReviews(
    params: BusinessesReviewsParams,
  ): Promise<ManagerResponse<BusinessesReviewsResponse[] | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_BUSINESS_FOUND)],
        null,
      );
    }
    const reviews = await this.provider.getReviews(business.businessId);
    reviews.forEach((review) => {
      review.name = review.name[0] + "*".repeat(review.name.length - 1);
      review.surname = review.surname[0] + "*".repeat(review.surname.length - 1);
    });
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      BusinessesReviewsResponse.fromModels(reviews),
    );
  }
}
