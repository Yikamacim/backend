import type { Membership } from "../../../app/enums/Membership.ts";
import type { IResponse } from "../../../app/interfaces/IResponse.ts";
import type { AccountModel } from "../../../app/models/AccountModel.ts";

export class SignupResponse implements IResponse {
  constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly membership: Membership,
  ) {}

  public static fromModel(model: AccountModel): SignupResponse {
    return new SignupResponse(model.accountId, model.username, model.membership);
  }

  public static fromModels(models: AccountModel[]): SignupResponse[] {
    return models.map((model: AccountModel): SignupResponse => SignupResponse.fromModel(model));
  }
}
