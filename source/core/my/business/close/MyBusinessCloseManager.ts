import type { MediaData } from "../../../../@types/medias";
import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
import { MyBusinessCloseProvider } from "./MyBusinessCloseProvider";
import { MyBusinessCloseResponse } from "./schemas/MyBusinessCloseResponse";

export class MyBusinessCloseManager implements IManager {
  public constructor(private readonly provider = new MyBusinessCloseProvider()) {}

  public async putMyBusinessClose(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessCloseResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (!business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_ALREADY_CLOSED)],
        null,
      );
    }
    const closedBusiness = await this.provider.closeBusiness(business.businessId);
    let mediaData: MediaData | null = null;
    if (closedBusiness.mediaId !== null) {
      const media = await this.provider.getBusinessMedia(
        closedBusiness.businessId,
        closedBusiness.mediaId,
      );
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND)],
          null,
        );
      }
      mediaData = await MediaHelper.mediaToMediaData(media);
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessCloseResponse.fromModel(closedBusiness, mediaData),
    );
  }
}
