import type { AccountType } from "../../../app/enums/AccountType";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountModel } from "../../../common/models/AccountModel";

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
