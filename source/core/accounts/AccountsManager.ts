import type { ManagerResponse, ProviderResponse } from "../../@types/responses.d.ts";
import type { IManager } from "../../app/interfaces/IManager.ts";
import type { AccountModel } from "../../app/models/AccountModel.ts";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { AccountsProvider } from "./AccountsProvider.ts";
import type { AccountsRequest } from "./schemas/AccountsRequest.ts";
import { AccountsResponse } from "./schemas/AccountsResponse.ts";

export class AccountsManager implements IManager {
  private readonly mProvider: AccountsProvider;

  constructor() {
    this.mProvider = new AccountsProvider();
  }

  public async getAccount(
    validatedData: AccountsRequest,
  ): Promise<ManagerResponse<AccountsResponse | null>> {
    // Try to get the account
    const providerResponse: ProviderResponse<AccountModel | null> = await this.mProvider.getAccount(
      validatedData.username,
    );
    // Check response
    if (!providerResponse.data) {
      // Return with error
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    // Return with success
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AccountsResponse.fromModel(providerResponse.data),
    );
  }
}
