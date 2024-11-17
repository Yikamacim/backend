import type { AccountType } from "../../../app/enums/AccountType";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountModel } from "../../../common/models/AccountModel";

export class SignupResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly accountType: AccountType,
  ) {}

  public static fromModel(model: AccountModel): SignupResponse {
    return new SignupResponse(model.accountId, model.username, model.accountType);
  }

  public static fromModels(models: AccountModel[]): SignupResponse[] {
    return models.map((model: AccountModel) => SignupResponse.fromModel(model));
  }
}
