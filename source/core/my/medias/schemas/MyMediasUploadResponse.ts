import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import type { IResponse } from "../../../../app/interfaces/IResponse";

export class MyMediasUploadResponse implements IResponse {
  private constructor(
    public readonly url: string,
    public readonly fields: Record<string, string>,
  ) {}

  public static fromModel(presignedPost: PresignedPost): MyMediasUploadResponse {
    return new MyMediasUploadResponse(presignedPost.url, presignedPost.fields);
  }
}
