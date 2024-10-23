import type { AccountType } from "../../../app/enums/AccountType.ts";
import type { IResponse } from "../../../app/interfaces/IResponse.ts";
import type { AccountModel } from "../../../app/models/AccountModel.ts";

export class AccountsResponse implements IResponse {
  private constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly type: AccountType,
  ) {}

  public static fromModel(model: AccountModel): AccountsResponse {
    return new AccountsResponse(model.accountId, model.username, model.accountType);
  }

  public static fromModels(models: AccountModel[]): AccountsResponse[] {
    return models.map((model: AccountModel): AccountsResponse => AccountsResponse.fromModel(model));
  }
}
