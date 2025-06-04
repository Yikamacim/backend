import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { ReviewProvider } from "../../../common/providers/ReviewProvider";

export class BusinessesReviewsProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly reviewProvider = new ReviewProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getReviewsByBusinessId = this.reviewProvider.getReviewsByBusinessId.bind(
      this.reviewProvider,
    );
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getReviewsByBusinessId: typeof this.reviewProvider.getReviewsByBusinessId;
}
