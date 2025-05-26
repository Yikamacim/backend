import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NotFound,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { createPresignedPost, type PresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import { LogHelper } from "../../../app/helpers/LogHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import type { EMediaType } from "../../../common/enums/EMediaType";
import { BucketConstants } from "../app/constants/BucketConstants";
import { ContentUtil } from "../app/utils/ContentUtil";

export class BucketHandler implements IHandler {
  public constructor(
    private readonly s3Client = new S3Client({ region: EnvironmentHelper.get().awsRegion }),
    private readonly bucketName = EnvironmentHelper.get().bucketName,
  ) {}

  public async getAccessUrl(name: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: name,
    });
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: BucketConstants.ACCESS_URL_EXPIRATION_TIME,
    });
  }

  public async getUploadUrl(name: string, mediaType: EMediaType): Promise<PresignedPost> {
    return await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: name,
      Conditions: [
        ["starts-with", "$Content-Type", ContentUtil.getContentTypePrefix(mediaType)],
        ["content-length-range", 0, ContentUtil.getContentLength(mediaType)],
      ],
      Expires: BucketConstants.UPLOAD_URL_EXPIRATION_TIME,
    });
  }

  public async listFiles(): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;
    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        ContinuationToken: continuationToken,
      });
      const response = await this.s3Client.send(command);
      if (response.Contents !== undefined) {
        for (const object of response.Contents) {
          if (object.Key !== undefined) {
            keys.push(object.Key);
          }
        }
      }
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
    return keys;
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

  public async deleteFile(key: string): Promise<void> {
    try {
      const exists = await this.checkFileExists(key);
      if (!exists) {
        return;
      }
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
    } catch (error: unknown) {
      if (error instanceof S3ServiceException) {
        LogHelper.failure(error.name, error.message);
      } else {
        LogHelper.failure("UnknownError", "An unknown error occurred while deleting the file.");
      }
      throw error;
    }
  }
}
