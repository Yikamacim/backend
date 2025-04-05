import { GetObjectCommand, HeadObjectCommand, NotFound, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost, type PresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import type { MediaType } from "../../../common/enums/MediaType";
import { UrlConstants } from "../app/constants/UrlConstants";
import { ContentUtil } from "../app/utils/ContentUtil";

export class BucketHandler implements IHandler {
  public constructor(
    private readonly s3Client = new S3Client({ region: EnvironmentHelper.get().awsRegion }),
    private readonly bucketName = EnvironmentHelper.get().bucketName,
  ) {}

  public async getAccessUrl(name: string): Promise<string> {
    // Create the get object command
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: name,
    });
    // Generate the signed URL
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: UrlConstants.URL_EXPIRE_TIME,
    });
  }

  public async getUploadUrl(name: string, mediaType: MediaType): Promise<PresignedPost> {
    return await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: name,
      Conditions: [
        ["starts-with", "$Content-Type", ContentUtil.getContentTypePrefix(mediaType)],
        ["content-length-range", 0, ContentUtil.getContentLength(mediaType)],
      ],
      Expires: UrlConstants.URL_EXPIRE_TIME,
    });
  }

  public async checkFileExists(name: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: name,
    });
    try {
      await this.s3Client.send(command);
      return true;
    } catch (error: unknown) {
      if (error instanceof NotFound) {
        return false;
      }
      throw error;
    }
  }
}
