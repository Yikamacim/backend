import type { ManagerResponse, ProviderResponse } from "../../@types/responses.d.ts";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper.ts";
import type { IManager } from "../../app/interfaces/IManager.ts";
import { AccountModel } from "../../common/models/AccountModel.ts";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { LoginProvider } from "./LoginProvider.ts";
import type { LoginRequest } from "./schemas/LoginRequest.ts";
import type { LoginResponse } from "./schemas/LoginResponse.ts";

export class LoginManager implements IManager {
  private readonly mProvider: LoginProvider;

  constructor() {
    this.mProvider = new LoginProvider();
  }

  public async postLogin(
    validatedData: LoginRequest,
  ): Promise<ManagerResponse<LoginResponse | null>> {
    // Try to get account
    const providerResponse: ProviderResponse<AccountModel | null> = await this.mProvider.getAccount(
      validatedData.username,
    );
    // Check response
    if (!providerResponse.data) {
      // No account found
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Account found, check password
    if (!(await EncryptionHelper.compare(validatedData.password, providerResponse.data.password))) {
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
      AccountModel.fromRecord(providerResponse.data),
    );
  }
}
