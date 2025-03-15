import type { AccountType } from "../../../app/enums/AccountType";
import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountModel } from "../../../common/models/AccountModel";

export class VerifyResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: AccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromModel(model: AccountModel): VerifyResponse {
    return new VerifyResponse(
      model.accountId,
      model.phone,
      model.name,
      model.surname,
      model.accountType,
      model.isVerified,
    );
  }

  public static fromModels(models: AccountModel[]): VerifyResponse[] {
    return models.map((model: AccountModel) => VerifyResponse.fromModel(model));
  }
}
