import type { IConstants } from "../../../../app/interfaces/IConstants";

export class MediaConstants implements IConstants {
  public static readonly AUDIO_MAX_SIZE = 5000000; // 5 MB
  public static readonly DOCUMENT_MAX_SIZE = 25000000; // 25 MB
  public static readonly IMAGE_MAX_SIZE = 5000000; // 5 MB
  public static readonly VIDEO_MAX_SIZE = 50000000; // 50 MB
}
