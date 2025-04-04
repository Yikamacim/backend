import { MediaType } from "../../../../app/enums/MediaType";
import type { IUtil } from "../../../../app/interfaces/IUtil";
import { UnexpectedMediaTypeError } from "../../../../app/schemas/ServerError";
import { MediaConstants } from "../constants/MediaConstants";

export class ContentUtil implements IUtil {
  public static getContentTypePrefix(mediaType: MediaType): string {
    switch (mediaType) {
      case MediaType.AUDIO:
        return "audio/";
      case MediaType.IMAGE:
        return "image/";
      case MediaType.VIDEO:
        return "video/";
      default:
        throw new UnexpectedMediaTypeError(mediaType);
    }
  }

  public static getContentLength(mediaType: MediaType): number {
    switch (mediaType) {
      case MediaType.AUDIO:
        return MediaConstants.AUDIO_MAX_SIZE;
      case MediaType.IMAGE:
        return MediaConstants.IMAGE_MAX_SIZE;
      case MediaType.VIDEO:
        return MediaConstants.VIDEO_MAX_SIZE;
      default:
        throw new UnexpectedMediaTypeError(mediaType);
    }
  }
}
