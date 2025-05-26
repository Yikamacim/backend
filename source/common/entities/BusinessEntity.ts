import type { IEntity } from "../../app/interfaces/IEntity";
import type { EServiceCategory } from "../enums/EServiceCategory";
import type { BusinessViewModel } from "../models/BusinessViewModel";
import type { MediaEntity } from "./MediaEntity";

export class BusinessEntity implements IEntity {
  public constructor(
    public readonly model: BusinessViewModel,
    public readonly media: MediaEntity | null,
    public readonly serviceCategories: EServiceCategory[],
    public readonly todayHours: {
      readonly from: string | null;
      readonly to: string | null;
    } | null,
  ) {}
}
