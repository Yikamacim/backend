import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { MediaType } from "../../../../common/enums/MediaType";

export class BusinessesMediasResponse implements IResponse {
  private constructor(
    public readonly mediaId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
    public readonly url: string,
  ) {}

  public static fromModel(media: MediaData): BusinessesMediasResponse {
    return new BusinessesMediasResponse(media.mediaId, media.mediaType, media.extension, media.url);
  }

  public static fromModels(medias: MediaData[]): BusinessesMediasResponse[] {
    return medias.map((model: MediaData) => BusinessesMediasResponse.fromModel(model));
  }
}
