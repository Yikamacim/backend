import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { MediaEntity } from "../../../../../common/entities/MediaEntity";
import type { EMediaType } from "../../../../../common/enums/EMediaType";

export class MyBusinessMediasResponse implements IResponse {
  private constructor(
    public readonly mediaId: number,
    public readonly mediaType: EMediaType,
    public readonly extension: string,
    public readonly url: string,
  ) {}

  public static fromEntity(entity: MediaEntity): MyBusinessMediasResponse {
    return new MyBusinessMediasResponse(
      entity.mediaId,
      entity.mediaType,
      entity.extension,
      entity.url,
    );
  }

  public static fromEntities(entities: MediaEntity[]): MyBusinessMediasResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
