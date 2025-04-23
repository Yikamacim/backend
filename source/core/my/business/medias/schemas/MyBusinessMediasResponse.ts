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

  public static fromModel(model: MediaData): MyBusinessMediasResponse {
    return new MyBusinessMediasResponse(model.mediaId, model.mediaType, model.extension, model.url);
  }
}
