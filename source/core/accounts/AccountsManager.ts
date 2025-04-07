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
    params: AccountsParams,
  ): Promise<ManagerResponse<AccountsResponse | null>> {
    const account = await this.provider.getAccount(params.phone);
    if (account === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.NO_ACCOUNT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      AccountsResponse.fromModel(account),
    );
  }
}
