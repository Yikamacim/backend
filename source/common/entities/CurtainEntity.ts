import type { IEntity } from "../../app/interfaces/IEntity";
import type { CurtainViewModel } from "../models/CurtainViewModel";
import type { MediaEntity } from "./MediaEntity";

export class CurtainEntity implements IEntity {
  public constructor(
    public readonly model: CurtainViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
