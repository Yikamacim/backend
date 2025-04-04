import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import type { MediaType } from "../../../app/enums/MediaType";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import { UrlConstants } from "../app/constants/UrlConstants";
import { ContentUtil } from "../app/utils/ContentUtil";

export class BucketHandler implements IHandler {
  public constructor(
    private readonly s3Client = new S3Client({ region: EnvironmentHelper.get().awsRegion }),
    private readonly bucketName = EnvironmentHelper.get().bucketName,
  ) {}

  public async getUploadUrl(fileName: string, mediaType: MediaType): Promise<string> {
    return (
      await createPresignedPost(this.s3Client, {
        Bucket: this.bucketName,
        Key: fileName,
        Conditions: [
          ["starts-with", "$Content-Type", ContentUtil.getContentTypePrefix(mediaType)],
          ["content-length-range", 0, ContentUtil.getContentLength(mediaType)],
        ],
        Expires: UrlConstants.URL_EXPIRE_TIME,
      })
    ).url;
  }
}
