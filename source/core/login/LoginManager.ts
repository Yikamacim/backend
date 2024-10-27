import type { ManagerResponse, ProviderResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import type { IManager } from "../../app/interfaces/IManager";
import { AccountModel } from "../../common/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginProvider } from "./LoginProvider";
import type { LoginRequest } from "./schemas/LoginRequest";
import type { LoginResponse } from "./schemas/LoginResponse";

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
