import type { IEntity } from "../../app/interfaces/IEntity";
import type { BlanketViewModel } from "../models/BlanketViewModel";
import type { MediaEntity } from "./MediaEntity";

export class BlanketEntity implements IEntity {
  public constructor(
    public readonly model: BlanketViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
