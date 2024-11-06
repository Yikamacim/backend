import type { AccountType } from "../../../app/enums/AccountType";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountModel } from "../../../common/models/AccountModel";

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
