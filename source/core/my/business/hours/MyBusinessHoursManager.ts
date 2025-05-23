import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MyBusinessHoursProvider } from "./MyBusinessHoursProvider";
import type { MyBusinessHoursRequest } from "./schemas/MyBusinessHoursRequest";
import { MyBusinessHoursResponse } from "./schemas/MyBusinessHoursResponse";

export class MyBusinessHoursManager implements IManager {
  public constructor(private readonly provider = new MyBusinessHoursProvider()) {}

  public async getMyBusinessHours(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessHoursResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const businessHours = await this.provider.getHours(business.businessId);
    if (businessHours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HOURS_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessHoursResponse.fromModel(businessHours),
    );
  }

  public async postMyBusinessHours(
    payload: TokenPayload,
    request: MyBusinessHoursRequest,
  ): Promise<ManagerResponse<MyBusinessHoursResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
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
    if ((await this.provider.getHours(business.businessId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HOURS_ALREADY_EXISTS)],
        null,
      );
    }
    const businessHours = await this.provider.createHours(
      business.businessId,
      request.mondayFrom,
      request.mondayTo,
      request.tuesdayFrom,
      request.tuesdayTo,
      request.wednesdayFrom,
      request.wednesdayTo,
      request.thursdayFrom,
      request.thursdayTo,
      request.fridayFrom,
      request.fridayTo,
      request.saturdayFrom,
      request.saturdayTo,
      request.sundayFrom,
      request.sundayTo,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessHoursResponse.fromModel(businessHours),
    );
  }

  public async putMyBusinessHours(
    payload: TokenPayload,
    request: MyBusinessHoursRequest,
  ): Promise<ManagerResponse<MyBusinessHoursResponse | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
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
    const businessHours = await this.provider.getHours(business.businessId);
    if (businessHours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HOURS_NOT_FOUND)],
        null,
      );
    }
    const updatedBusinessHours = await this.provider.updateHours(
      business.businessId,
      request.mondayFrom,
      request.mondayTo,
      request.tuesdayFrom,
      request.tuesdayTo,
      request.wednesdayFrom,
      request.wednesdayTo,
      request.thursdayFrom,
      request.thursdayTo,
      request.fridayFrom,
      request.fridayTo,
      request.saturdayFrom,
      request.saturdayTo,
      request.sundayFrom,
      request.sundayTo,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessHoursResponse.fromModel(updatedBusinessHours),
    );
  }
}
