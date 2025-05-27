import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { HoursEntity } from "../../../../common/entities/HoursEntity";
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
        [new ClientError(ClientErrorCode.HAS_NO_BUSINESS)],
        null,
      );
    }
    const hours = await this.provider.getHours(business.businessId);
    if (hours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HOURS_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessHoursResponse.fromEntity(new HoursEntity(hours)),
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
    if ((await this.provider.getHours(business.businessId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.HOURS_ALREADY_EXISTS)],
        null,
      );
    }
    const hours = await this.provider.createHours(
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
      MyBusinessHoursResponse.fromEntity(new HoursEntity(hours)),
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
    const hours = await this.provider.getHours(business.businessId);
    if (hours === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.HOURS_NOT_FOUND)],
        null,
      );
    }
    const updatedHours = await this.provider.updateHours(
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
      MyBusinessHoursResponse.fromEntity(new HoursEntity(updatedHours)),
    );
  }
}
