import type { IEntity } from "../../app/interfaces/IEntity";
import type { DistrictModel } from "../models/DistrictModel";

export class DistrictEntity implements IEntity {
  public constructor(public readonly model: DistrictModel) {}
}
