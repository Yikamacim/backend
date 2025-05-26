import type { IEntity } from "../../app/interfaces/IEntity";
import type { BusinessServiceViewModel } from "../models/BusinessServiceViewModel";
import type { MediaEntity } from "./MediaEntity";

export class SearchEntity implements IEntity {
  public constructor(
    public readonly model: BusinessServiceViewModel,
    public readonly media: MediaEntity | null,
  ) {}
}
