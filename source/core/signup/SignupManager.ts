import type { ManagerResponse, ProviderResponse } from "../../@types/responses.d.ts";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper.ts";
import type { IManager } from "../../app/interfaces/IManager.ts";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import type { AccountModel } from "../../common/models/AccountModel.ts";
import { SignupProvider } from "./SignupProvider.ts";
import type { SignupRequest } from "./schemas/SignupRequest.ts";
import { SignupResponse } from "./schemas/SignupResponse.ts";

export class SignupManager implements IManager {
  private readonly mProvider: SignupProvider;

  constructor() {
    this.mProvider = new SignupProvider();
  }

  public async postSignup(
    validatedData: SignupRequest,
  ): Promise<ManagerResponse<SignupResponse | null>> {
    // Check if account with username already exists
    if ((await this.mProvider.doesAccountExist(validatedData.username)).data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS)],
        null,
      );
    }
    // Account not found, create one
    const providerResponse: ProviderResponse<AccountModel> = await this.mProvider.createAccount(
      validatedData.username,
      await EncryptionHelper.encrypt(validatedData.password),
      validatedData.accountType,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      SignupResponse.fromModel(providerResponse.data),
    );
  }
}
