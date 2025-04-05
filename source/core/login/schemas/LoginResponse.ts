import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountType } from "../../../common/enums/AccountType";
import type { AccountModel } from "../../../common/models/AccountModel";

export class LoginResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: AccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromModel(model: AccountModel): LoginResponse {
    return new LoginResponse(
      model.accountId,
      model.phone,
      model.name,
      model.surname,
      model.accountType,
      model.isVerified,
    );
  }

  public static fromModels(models: AccountModel[]): LoginResponse[] {
    return models.map((model: AccountModel) => LoginResponse.fromModel(model));
  }
}
