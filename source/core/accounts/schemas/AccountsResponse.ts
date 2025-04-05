import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountType } from "../../../common/enums/AccountType";
import type { AccountModel } from "../../../common/models/AccountModel";

export class AccountsResponse implements IResponse {
  private constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly type: AccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromModel(model: AccountModel): AccountsResponse {
    return new AccountsResponse(
      model.accountId,
      model.phone,
      model.name,
      model.surname,
      model.accountType,
      model.isVerified,
    );
  }

  public static fromModels(models: AccountModel[]): AccountsResponse[] {
    return models.map((model: AccountModel) => AccountsResponse.fromModel(model));
  }
}
