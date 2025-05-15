import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MediaHelper } from "../../../common/helpers/MediaHelper";
import { BusinessesMediasProvider } from "./MyBusinessMediasProvider";
import type { BusinessesMediasParams } from "./schemas/BusinessesMediasParams";
import { BusinessesMediasResponse } from "./schemas/BusinessesMediasResponse";

export class BusinessesMediasManager implements IManager {
  public constructor(private readonly provider = new BusinessesMediasProvider()) {}

  public async getBusinessesMedias(
    params: BusinessesMediasParams,
  ): Promise<ManagerResponse<BusinessesMediasResponse[] | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const businessMedias = await this.provider.getBusinessMedias(business.businessId);
    const mediaDatas = await MediaHelper.mediasToMediaDatas(businessMedias);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      BusinessesMediasResponse.fromModels(mediaDatas),
    );
  }
}
