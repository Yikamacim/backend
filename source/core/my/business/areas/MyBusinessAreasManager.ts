import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { AreaEntity } from "../../../../common/entities/AreaEntity";
import { MyBusinessAreasProvider } from "./MyBusinessAreasProvider";
import type { MyBusinessAreasParams } from "./schemas/MyBusinessAreasParams";
import type { MyBusinessAreasRequest } from "./schemas/MyBusinessAreasRequest";
import { MyBusinessAreasResponse } from "./schemas/MyBusinessAreasResponse";

export class MyBusinessAreasManager implements IManager {
  public constructor(private readonly provider = new MyBusinessAreasProvider()) {}

  public async getMyBusinessAreas(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessAreasResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    const areas = await this.provider.getBusinessAreas(business.businessId);
    const entities = areas.map((area) => new AreaEntity(area));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessAreasResponse.fromEntities(entities),
    );
  }

  public async postMyBusinessAreas(
    payload: TokenPayload,
    request: MyBusinessAreasRequest,
  ): Promise<ManagerResponse<MyBusinessAreasResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    const areas = await this.provider.getBusinessAreas(business.businessId);
    if (areas.some((area) => area.neighborhoodId === request.neighborhoodId)) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.AREA_ALREADY_EXISTS)],
        null,
      );
    }
    const area = await this.provider.createBusinessArea(
      business.businessId,
      request.neighborhoodId,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessAreasResponse.fromEntity(new AreaEntity(area)),
    );
  }

  public async deleteMyBusinessAreas$(
    payload: TokenPayload,
    params: MyBusinessAreasParams,
  ): Promise<ManagerResponse<null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    if (business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_OPEN)],
        null,
      );
    }
    await this.provider.deleteBusinessArea(business.businessId, parseInt(params.neighborhoodId));
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
