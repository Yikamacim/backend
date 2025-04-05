import type { MediaType } from "../common/enums/MediaType";

export type MediaData = {
  mediaId: number;
  mediaType: MediaType;
  extension: string;
  url: string;
};
