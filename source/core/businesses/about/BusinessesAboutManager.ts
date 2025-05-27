import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AboutEntity } from "../../../common/entities/AboutEntity";
import { BusinessesAboutProvider } from "./BusinessesAboutProvider";
import type { BusinessesAboutParams } from "./schemas/BusinessesAboutParams";
import { BusinessesAboutResponse } from "./schemas/BusinessesAboutResponse";

export class BusinessesAboutManager implements IManager {
  public constructor(private readonly provider = new BusinessesAboutProvider()) {}

  public async getBusinessesAbout(
    params: BusinessesAboutParams,
  ): Promise<ManagerResponse<BusinessesAboutResponse | null>> {
    const business = await this.provider.getBusiness(parseInt(params.businessId));
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const hours = await this.provider.getHours(business.businessId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      BusinessesAboutResponse.fromEntity(new AboutEntity(business, hours)),
    );
  }
}
