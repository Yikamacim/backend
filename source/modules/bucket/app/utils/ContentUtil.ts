import type { IUtil } from "../../../../app/interfaces/IUtil";
import { UnexpectedMediaTypeError } from "../../../../app/schemas/ServerError";
import { EMediaType } from "../../../../common/enums/EMediaType";
import { MediaConstants } from "../constants/MediaConstants";

export class ContentUtil implements IUtil {
  public static getContentTypePrefix(mediaType: EMediaType): string {
    switch (mediaType) {
      case EMediaType.AUDIO:
        return "audio/";
      case EMediaType.DOCUMENT:
        return "application/";
      case EMediaType.IMAGE:
        return "image/";
      case EMediaType.VIDEO:
        return "video/";
      default:
        throw new UnexpectedMediaTypeError(mediaType);
    }
  }

  public static getContentLength(mediaType: EMediaType): number {
    switch (mediaType) {
      case EMediaType.AUDIO:
        return MediaConstants.AUDIO_MAX_SIZE;
      case EMediaType.DOCUMENT:
        return MediaConstants.DOCUMENT_MAX_SIZE;
      case EMediaType.IMAGE:
        return MediaConstants.IMAGE_MAX_SIZE;
      case EMediaType.VIDEO:
        return MediaConstants.VIDEO_MAX_SIZE;
      default:
        throw new UnexpectedMediaTypeError(mediaType);
    }
  }
}
