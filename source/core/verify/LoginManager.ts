import type { ManagerResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginProvider } from "./LoginProvider";
import type { VerifyRequest } from "./schemas/VerifyRequest";
import { VerifyResponse } from "./schemas/VerifyResponse";

export class LoginManager implements IManager {
  public constructor(private readonly provider = new LoginProvider()) {}

  public async postLogin(
    validatedData: VerifyRequest,
  ): Promise<ManagerResponse<VerifyResponse | null>> {
    // Try to get account
    const providerResponse = await this.provider.getAccount(validatedData.phone);
    // If no account found
    if (!providerResponse.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Account found, check password
    if (!(await EncryptionHelper.compare(validatedData.code, providerResponse.data.password))) {
      // Passwords don't match
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.UNAUTHORIZED),
        null,
        [new ClientError(ClientErrorCode.INCORRECT_PASSWORD)],
        null,
      );
    }
    // Passwords match
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      VerifyResponse.fromModel(providerResponse.data),
    );
  }
}
