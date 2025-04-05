import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaType } from "../../../common/enums/MediaType";
import { BucketModule } from "../../../modules/bucket/module";
import { MyMediasProvider } from "./MyMediasProvider";
import { MyMediasUploadResponse } from "./schemas/MyMediasUploadResponse";

export class MyMediasManager implements IManager {
  public constructor(private readonly provider = new MyMediasProvider()) {}

  public async getMyMediasUpload$mediaType(
    accountId: number,
    mediaType: MediaType,
    extension: string,
  ): Promise<ManagerResponse<MyMediasUploadResponse>> {
    // Create my media
    const prCreateMyMedia = await this.provider.createMyMedia(accountId, mediaType, extension);
    // Return with upload url
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyMediasUploadResponse.fromModel(
        prCreateMyMedia.data.mediaId,
        await BucketModule.instance.getUploadUrl(
          `${prCreateMyMedia.data.mediaId.toString()}.${extension}`,
          mediaType,
        ),
      ),
    );
  }
}
