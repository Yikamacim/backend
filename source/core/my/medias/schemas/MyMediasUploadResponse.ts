import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import type { IResponse } from "../../../../app/interfaces/IResponse";

export class MyMediasUploadResponse implements IResponse {
  private constructor(
    public readonly mediaId: number,
    public readonly url: string,
    public readonly fields: Record<string, string>,
  ) {}

  public static fromModel(mediaId: number, presignedPost: PresignedPost): MyMediasUploadResponse {
    return new MyMediasUploadResponse(mediaId, presignedPost.url, presignedPost.fields);
  }
}
