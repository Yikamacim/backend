import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ReviewEntity } from "../../../../common/entities/ReviewEntity";

export class BusinessesReviewsResponse implements IResponse {
  private constructor(
    public readonly reviewId: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly stars: number,
    public readonly comment: string,
    public readonly leavedAt: Date,
    public readonly reply: string | null,
  ) {}

  public static fromEntity(entity: ReviewEntity): BusinessesReviewsResponse {
    return new BusinessesReviewsResponse(
      entity.model.reviewId,
      entity.model.name,
      entity.model.surname,
      entity.model.stars,
      entity.model.comment,
      entity.model.leavedAt,
      entity.model.reply,
    );
  }

  public static fromEntities(entities: ReviewEntity[]): BusinessesReviewsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
