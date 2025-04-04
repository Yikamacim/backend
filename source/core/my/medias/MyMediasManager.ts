import type { ManagerResponse } from "../../../@types/responses";
import type { MediaType } from "../../../app/enums/MediaType";
import type { IManager } from "../../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BucketModule } from "../../../modules/bucket/module";
import { MyMediasProvider } from "./MyMediasProvider";
import { MyMediasUploadResponse } from "./schemas/MyMediasUploadResponse";

export class MyMediasManager implements IManager {
  public constructor(private readonly provider = new MyMediasProvider()) {}

  public async getMyMediasUpload$mediaType(
    accountId: number,
    mediaType: MediaType,
  ): Promise<ManagerResponse<MyMediasUploadResponse>> {
    // Create my media
    const prCreateMyMedia = await this.provider.createMyMedia(accountId, mediaType);
    // Return with upload url
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyMediasUploadResponse.fromModel(
        await BucketModule.instance.getUploadUrl(
          prCreateMyMedia.data.mediaId.toString(),
          mediaType,
        ),
      ),
    );
  }
}
