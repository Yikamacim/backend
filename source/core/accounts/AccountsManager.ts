import type { ManagerResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountsProvider } from "./AccountsProvider";
import type { AccountsParams } from "./schemas/AccountsParams";
import { AccountsResponse } from "./schemas/AccountsResponse";

export class AccountsManager implements IManager {
  public constructor(private readonly provider = new AccountsProvider()) {}

  public async getAccount(
    validatedData: AccountsParams,
  ): Promise<ManagerResponse<AccountsResponse | null>> {
    // Try to get the account
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
    // Return account
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AccountsResponse.fromModel(prGetAccount.data),
    );
  }
}
