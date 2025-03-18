import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SmsModule } from "../../modules/sms/module";
import type { VerifyParams } from "./schemas/VerifyParams";
import type { VerifyRequest } from "./schemas/VerifyRequest";
import { VerifyResponse } from "./schemas/VerifyResponse";
import { VerifyProvider } from "./VerifyProvider";

export class VerifyManager implements IManager {
  public constructor(private readonly provider = new VerifyProvider()) {}

  public async getVerify$phone(validatedData: VerifyParams): Promise<ManagerResponse<null>> {
    // Try to get account
    const prGetAccount = await this.provider.getAccount(validatedData.phone);
    // If no account found
    if (!prGetAccount.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Account found, check verification
    if (prGetAccount.data.isVerified) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.PHONE_ALREADY_VERIFIED)],
        null,
      );
    }
    // Check if verification code not expired
    if (!(await this.provider.isCodeExpired(validatedData.phone))) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.CODE_NOT_EXPIRED)],
        null,
      );
    }
    // Code expired or not found, return success
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }

  public async postVerify(
    validatedData: VerifyRequest,
  ): Promise<ManagerResponse<VerifyResponse | null>> {
    // Try to get account
    const prGetAccount = await this.provider.getAccount(validatedData.phone);
    // If no account found
    if (!prGetAccount.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Account found, check verification
    if (prGetAccount.data.isVerified) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.PHONE_ALREADY_VERIFIED)],
        null,
      );
    }
    // Check if verification code expired
    if (await this.provider.isCodeExpired(validatedData.phone)) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.CODE_EXPIRED)],
        null,
      );
    }
    if (!(await SmsModule.instance.verify(validatedData.phone, validatedData.code))) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.INVALID_CODE)],
        null,
      );
    }
    // Verification successful, update account
    await this.provider.verifyAccount(prGetAccount.data.accountId);
    // Return
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      VerifyResponse.fromModel(prGetAccount.data),
    );
  }
}
