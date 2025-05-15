import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ReviewViewModel } from "../../../../common/models/ReviewViewModel";

export class BusinessesReviewsResponse implements IResponse {
  private constructor(
    public readonly reviewId: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly stars: number,
    public readonly comment: string,
    public readonly reply: string | null,
  ) {}

  public static fromModel(model: ReviewViewModel): BusinessesReviewsResponse {
    return new BusinessesReviewsResponse(
      model.reviewId,
      model.name,
      model.surname,
      model.stars,
      model.comment,
      model.reply,
    );
  }

  public static fromModels(models: ReviewViewModel[]): BusinessesReviewsResponse[] {
    return models.map((model: ReviewViewModel): BusinessesReviewsResponse => this.fromModel(model));
  }
}
