import type { Membership } from "../../../app/enums/Membership.ts";
import type { IResponse } from "../../../app/interfaces/IResponse.ts";
import type { AccountModel } from "../../../app/models/AccountModel.ts";

export class LoginResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly membership: Membership,
  ) {}

  public static fromModel(model: AccountModel): LoginResponse {
    return new LoginResponse(model.accountId, model.username, model.membership);
  }

  public static fromModels(models: AccountModel[]): LoginResponse[] {
    return models.map((model: AccountModel): LoginResponse => LoginResponse.fromModel(model));
  }
}
