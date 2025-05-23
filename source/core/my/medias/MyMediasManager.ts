import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { FileUtil } from "../../../app/utils/FileUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaType } from "../../../common/enums/MediaType";
import { BucketModule } from "../../../modules/bucket/module";
import { MyMediasProvider } from "./MyMediasProvider";
import type { MyMediasUploadParams } from "./schemas/MyMediasUploadParams";
import type { MyMediasUploadQueries } from "./schemas/MyMediasUploadQueries";
import { MyMediasUploadResponse } from "./schemas/MyMediasUploadResponse";

export class MyMediasManager implements IManager {
  public constructor(private readonly provider = new MyMediasProvider()) {}

  public async getMyMediasUpload$(
    payload: TokenPayload,
    params: MyMediasUploadParams,
    queries: MyMediasUploadQueries,
  ): Promise<ManagerResponse<MyMediasUploadResponse>> {
    const media = await this.provider.createMyMedia(
      payload.accountId,
      params.mediaType.toUpperCase() as MediaType,
      queries.extension,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyMediasUploadResponse.fromModel(
        media.mediaId,
        await BucketModule.instance.getUploadUrl(
          FileUtil.getName(media.mediaId.toString(), media.extension),
          media.mediaType,
        ),
      ),
    );
  }
}
