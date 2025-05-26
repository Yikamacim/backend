import type { IEntity } from "../../app/interfaces/IEntity";
import type { HoursModel } from "../models/HoursModel";

export class HoursEntity implements IEntity {
  public constructor(public readonly model: HoursModel) {}
}
