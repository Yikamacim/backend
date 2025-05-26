import type { IEntity } from "../../app/interfaces/IEntity";
import type { AreaViewModel } from "../models/AreaViewModel";

export class AreaEntity implements IEntity {
  public constructor(public readonly model: AreaViewModel) {}
}
