import type { IConstants } from "../../../../app/interfaces/IConstants";

export class MediaConstants implements IConstants {
  public static readonly AUDIO_MAX_SIZE = 5242880; // 5 MB
  public static readonly IMAGE_MAX_SIZE = 5242880; // 5 MB
  public static readonly VIDEO_MAX_SIZE = 52428800; // 50 MB
}
