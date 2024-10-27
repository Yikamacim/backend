import type { ManagerResponse, ProviderResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import type { AccountModel } from "../../common/models/AccountModel";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountsProvider } from "./AccountsProvider";
import type { AccountsParams } from "./schemas/AccountsParams";
import { AccountsResponse } from "./schemas/AccountsResponse";

export class AccountsManager implements IManager {
  private readonly mProvider: AccountsProvider;

  constructor() {
    this.mProvider = new AccountsProvider();
  }

  public async getAccount(
    validatedData: AccountsParams,
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
