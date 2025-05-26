import type { IEntity } from "../../app/interfaces/IEntity";
import type { ProvinceModel } from "../models/ProvinceModel";

export class ProvinceEntity implements IEntity {
  public constructor(public readonly model: ProvinceModel) {}
}
