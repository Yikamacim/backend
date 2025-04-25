import type { MediaData } from "../../../../../@types/medias";
import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { MediaType } from "../../../../../common/enums/MediaType";

export class MyBusinessMediasResponse implements IResponse {
  private constructor(
    public readonly mediaId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
    public readonly url: string,
  ) {}

  public static fromModel(media: MediaData): MyBusinessMediasResponse {
    return new MyBusinessMediasResponse(media.mediaId, media.mediaType, media.extension, media.url);
  }

  public static fromModels(medias: MediaData[]): MyBusinessMediasResponse[] {
    return medias.map((model: MediaData) => MyBusinessMediasResponse.fromModel(model));
  }
}
