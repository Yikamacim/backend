import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import type { IEntity } from "../../app/interfaces/IEntity";

export class UploadEntity implements IEntity {
  public constructor(
    public readonly mediaId: number,
    public readonly uploadUrl: PresignedPost,
  ) {}
}
