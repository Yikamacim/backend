import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MyBusinessBankProvider } from "./MyBusinessBankProvider";
import type { MyBusinessBankRequest } from "./schemas/MyBusinessBankRequest";
import { MyBusinessBankResponse } from "./schemas/MyBusinessBankResponse";

export class MyBusinessBankManager implements IManager {
  public constructor(private readonly provider = new MyBusinessBankProvider()) {}

  public async getMyBusinessBank(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessBankResponse | null>> {
    const business = await this.provider.getBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const businessBank = await this.provider.getBusinessBank(business.businessId);
    if (businessBank === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BANK_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessBankResponse.fromModel(businessBank),
    );
  }

  public async postMyBusinessBank(
    payload: TokenPayload,
    request: MyBusinessBankRequest,
  ): Promise<ManagerResponse<MyBusinessBankResponse | null>> {
    const business = await this.provider.getBusiness(payload.accountId);
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
    if ((await this.provider.getBusinessBank(business.businessId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BANK_ALREADY_EXISTS)],
        null,
      );
    }
    const businessBank = await this.provider.createBusinessBank(
      business.businessId,
      request.owner,
      request.iban,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessBankResponse.fromModel(businessBank),
    );
  }

  public async putMyBusinessBank(
    payload: TokenPayload,
    request: MyBusinessBankRequest,
  ): Promise<ManagerResponse<MyBusinessBankResponse | null>> {
    const business = await this.provider.getBusiness(payload.accountId);
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
    const businessBank = await this.provider.getBusinessBank(business.businessId);
    if (businessBank === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BANK_NOT_FOUND)],
        null,
      );
    }
    const updatedBusinessBank = await this.provider.updateBusinessBank(
      business.businessId,
      request.owner,
      request.iban,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessBankResponse.fromModel(updatedBusinessBank),
    );
  }
}
