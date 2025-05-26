import type { IEntity } from "../../app/interfaces/IEntity";
import type { BusinessViewModel } from "../models/BusinessViewModel";
import type { HoursModel } from "../models/HoursModel";

export class AboutEntity implements IEntity {
  public constructor(
    public readonly model: BusinessViewModel,
    public readonly hours: HoursModel | null,
  ) {}
}
