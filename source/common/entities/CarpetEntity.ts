import type { IEntity } from "../../app/interfaces/IEntity";
import type { CarpetViewModel } from "../models/CarpetViewModel";
import type { MediaEntity } from "./MediaEntity";

export class CarpetEntity implements IEntity {
  public constructor(
    public readonly model: CarpetViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
