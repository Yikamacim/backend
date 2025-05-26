import type { IHelper } from "../../app/interfaces/IHelper";
import type { ReviewViewModel } from "../models/ReviewViewModel";

export class ReviewHelper implements IHelper {
  public static obfuscate(review: ReviewViewModel): void {
    review.name = review.name[0] + "*".repeat(review.name.length - 1);
    review.surname = review.surname[0] + "*".repeat(review.surname.length - 1);
  }
}
