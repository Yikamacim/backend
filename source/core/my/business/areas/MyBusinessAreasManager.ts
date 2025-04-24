import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MyBusinessAreasProvider } from "./MyBusinessAreasProvider";
import type { MyBusinessAreasParams } from "./schemas/MyBusinessAreasParams";
import type { MyBusinessAreasRequest } from "./schemas/MyBusinessAreasRequest";
import { MyBusinessAreasResponse } from "./schemas/MyBusinessAreasResponse";

export class MyBusinessAreasManager implements IManager {
  public constructor(private readonly provider = new MyBusinessAreasProvider()) {}

  public async getMyBusinessAreas(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessAreasResponse[] | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const myBusinessAreas = await this.provider.getMyBusinessAreas(myBusiness.businessId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessAreasResponse.fromModels(myBusinessAreas),
    );
  }

  public async postMyBusinessAreas(
    payload: TokenPayload,
    request: MyBusinessAreasRequest,
  ): Promise<ManagerResponse<MyBusinessAreasResponse | null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const myBusinessAreas = await this.provider.getMyBusinessAreas(myBusiness.businessId);
    if (myBusinessAreas.some((area) => area.neighborhoodId === request.neighborhoodId)) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_AREA_ALREADY_EXISTS)],
        null,
      );
    }
    const area = await this.provider.createBusinessArea(
      myBusiness.businessId,
      request.neighborhoodId,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessAreasResponse.fromModel(area),
    );
  }

  public async deleteMyBusinessAreas$(
    payload: TokenPayload,
    params: MyBusinessAreasParams,
  ): Promise<ManagerResponse<null>> {
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    if (myBusiness.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    await this.provider.deleteBusinessArea(myBusiness.businessId, parseInt(params.neighborhoodId));
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
