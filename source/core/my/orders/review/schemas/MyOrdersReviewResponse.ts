import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ReviewEntity } from "../../../../../common/entities/ReviewEntity";

export class MyOrdersReviewResponse implements IResponse {
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

  public static fromEntity(entity: ReviewEntity): MyOrdersReviewResponse {
    return new MyOrdersReviewResponse(
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

  public static fromEntities(entities: ReviewEntity[]): MyOrdersReviewResponse[] {
    return entities.map((entity) => MyOrdersReviewResponse.fromEntity(entity));
  }
}
