import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { DateUtil } from "../../app/utils/DateUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SmsConstants } from "../../modules/sms/app/constants/SmsConstants";
import { SmsModule } from "../../modules/sms/module";
import type { VerifyParams } from "./schemas/VerifyParams";
import type { VerifyRequest } from "./schemas/VerifyRequest";
import { VerifyResponse } from "./schemas/VerifyResponse";
import { VerifyProvider } from "./VerifyProvider";

export class VerifyManager implements IManager {
  public constructor(private readonly provider = new VerifyProvider()) {}

  public async postVerify(request: VerifyRequest): Promise<ManagerResponse<VerifyResponse | null>> {
    const myAccount = await this.provider.getAccount(request.phone);
    if (myAccount === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    if (myAccount.isVerified) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.PHONE_ALREADY_VERIFIED)],
        null,
      );
    }
    const verification = await this.provider.getVerification(request.phone);
    if (verification === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_VERIFICATION_FOUND)],
        null,
      );
    }
    if (DateUtil.isExpired(verification.sentAt, SmsConstants.CODE_EXPIRATION_TIME)) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.CODE_EXPIRED)],
        null,
      );
    }
    if (!(await SmsModule.instance.verify(request.phone, request.code))) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.INVALID_CODE)],
        null,
      );
    }
    await this.provider.verifyAccount(myAccount.accountId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      VerifyResponse.fromModel(myAccount),
    );
  }

  public async getVerify$(data: VerifyParams): Promise<ManagerResponse<null>> {
    const myAccount = await this.provider.getAccount(data.phone);
    if (myAccount === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    if (myAccount.isVerified) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.PHONE_ALREADY_VERIFIED)],
        null,
      );
    }
    const verification = await this.provider.getVerification(data.phone);
    if (verification !== null) {
      if (!DateUtil.isExpired(verification.sentAt, SmsConstants.CODE_EXPIRATION_TIME)) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.FORBIDDEN),
          null,
          [new ClientError(ClientErrorCode.CODE_NOT_EXPIRED)],
          null,
        );
      }
    }
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }
}
