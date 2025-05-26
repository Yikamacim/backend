import type { IEntity } from "../../app/interfaces/IEntity";
import type { ReviewViewModel } from "../models/ReviewViewModel";

export class ReviewEntity implements IEntity {
  public constructor(public readonly model: ReviewViewModel) {}
}
