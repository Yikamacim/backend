import type { AccountType } from "../../../app/enums/AccountType.ts";
import type { IResponse } from "../../../app/interfaces/IResponse.ts";
import type { AccountModel } from "../../../app/models/AccountModel.ts";

export class SignupResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly accountType: AccountType,
  ) {}

  public static fromModel(model: AccountModel): SignupResponse {
    return new SignupResponse(model.accountId, model.username, model.accountType);
  }

  public static fromModels(models: AccountModel[]): SignupResponse[] {
    return models.map((model: AccountModel): SignupResponse => SignupResponse.fromModel(model));
  }
}
