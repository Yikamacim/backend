import type { AccountType } from "../../../app/enums/AccountType";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountModel } from "../../../common/models/AccountModel";

export class LoginResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly accountType: AccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromModel(model: AccountModel): LoginResponse {
    return new LoginResponse(model.accountId, model.phone, model.accountType, model.isVerified);
  }

  public static fromModels(models: AccountModel[]): LoginResponse[] {
    return models.map((model: AccountModel) => LoginResponse.fromModel(model));
  }
}
