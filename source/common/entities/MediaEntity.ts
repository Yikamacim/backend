import type { IEntity } from "../../app/interfaces/IEntity";
import type { EMediaType } from "../enums/EMediaType";

export class MediaEntity implements IEntity {
  public constructor(
    public readonly mediaId: number,
    public readonly mediaType: EMediaType,
    public readonly extension: string,
    public readonly url: string,
  ) {}
}
