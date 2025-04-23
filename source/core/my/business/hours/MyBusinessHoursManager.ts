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
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const myBusinessHours = await this.provider.getMyBusinessHours(myBusiness.businessId);
    if (myBusinessHours === null) {
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
      MyBusinessHoursResponse.fromModel(myBusinessHours),
    );
  }

  public async postMyBusinessHours(
    payload: TokenPayload,
    request: MyBusinessHoursRequest,
  ): Promise<ManagerResponse<MyBusinessHoursResponse | null>> {
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
    if ((await this.provider.getMyBusinessHours(myBusiness.businessId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HOURS_ALREADY_EXISTS)],
        null,
      );
    }
    const myBusinessHours = await this.provider.createBusinessHours(
      myBusiness.businessId,
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
      MyBusinessHoursResponse.fromModel(myBusinessHours),
    );
  }

  public async putMyBusinessHours(
    payload: TokenPayload,
    request: MyBusinessHoursRequest,
  ): Promise<ManagerResponse<MyBusinessHoursResponse | null>> {
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
    const myBusinessHours = await this.provider.getMyBusinessHours(myBusiness.businessId);
    if (myBusinessHours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HOURS_NOT_FOUND)],
        null,
      );
    }
    const myUpdatedBusinessHours = await this.provider.updateBusinessHours(
      myBusiness.businessId,
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
      MyBusinessHoursResponse.fromModel(myUpdatedBusinessHours),
    );
  }
}
