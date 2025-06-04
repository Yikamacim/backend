import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ReviewEntity } from "../../../../../common/entities/ReviewEntity";
import { MyOrdersReviewResponse } from "../../../orders/review/schemas/MyOrdersReviewResponse";

export class MyBusinessReviewsResponse implements IResponse {
  private constructor(
    public readonly reviewId: number,
    public readonly businessId: number,
    public readonly orderId: number,
    public name: string,
    public surname: string,
    public readonly stars: number,
    public readonly comment: string,
    public readonly leavedAt: Date,
    public readonly reply: string | null,
  ) {}

  public static fromEntity(entity: ReviewEntity): MyBusinessReviewsResponse {
    return new MyBusinessReviewsResponse(
      entity.model.reviewId,
      entity.model.businessId,
      entity.model.orderId,
      entity.model.name,
      entity.model.surname,
      entity.model.stars,
      entity.model.comment,
      entity.model.leavedAt,
      entity.model.reply,
    );
  }

  public static fromEntities(entities: ReviewEntity[]): MyBusinessReviewsResponse[] {
    return entities.map((entity) => MyOrdersReviewResponse.fromEntity(entity));
  }
}
