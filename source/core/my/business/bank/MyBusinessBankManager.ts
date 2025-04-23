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
    const myBusiness = await this.provider.getMyBusiness(payload.accountId);
    if (myBusiness === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const myBusinessBank = await this.provider.getMyBusinessBank(myBusiness.businessId);
    if (myBusinessBank === null) {
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
      MyBusinessBankResponse.fromModel(myBusinessBank),
    );
  }

  public async postMyBusinessBank(
    payload: TokenPayload,
    request: MyBusinessBankRequest,
  ): Promise<ManagerResponse<MyBusinessBankResponse | null>> {
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
    if ((await this.provider.getMyBusinessBank(myBusiness.businessId)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BANK_ALREADY_EXISTS)],
        null,
      );
    }
    const myBusinessBank = await this.provider.createBusinessBank(
      myBusiness.businessId,
      request.owner,
      request.iban,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessBankResponse.fromModel(myBusinessBank),
    );
  }

  public async putMyBusinessBank(
    payload: TokenPayload,
    request: MyBusinessBankRequest,
  ): Promise<ManagerResponse<MyBusinessBankResponse | null>> {
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
    const myBusinessBank = await this.provider.getMyBusinessBank(myBusiness.businessId);
    if (myBusinessBank === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BANK_NOT_FOUND)],
        null,
      );
    }
    const myUpdatedBusinessBank = await this.provider.updateBusinessBank(
      myBusiness.businessId,
      request.owner,
      request.iban,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessBankResponse.fromModel(myUpdatedBusinessBank),
    );
  }
}
