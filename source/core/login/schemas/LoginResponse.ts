import type { AccountType } from "../../../app/enums/AccountType.ts";
import type { IResponse } from "../../../app/interfaces/IResponse.ts";
import type { AccountModel } from "../../../common/models/AccountModel.ts";

export class LoginResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly accountType: AccountType,
  ) {}

  public static fromModel(model: AccountModel): LoginResponse {
    return new LoginResponse(model.accountId, model.username, model.accountType);
  }

  public static fromModels(models: AccountModel[]): LoginResponse[] {
    return models.map((model: AccountModel): LoginResponse => LoginResponse.fromModel(model));
  }
}
