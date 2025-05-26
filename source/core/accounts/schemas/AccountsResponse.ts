import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountEntity } from "../../../common/entities/AccountEntity";
import type { EAccountType } from "../../../common/enums/EAccountType";

export class AccountsResponse implements IResponse {
  private constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: EAccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromEntity(entity: AccountEntity): AccountsResponse {
    return new AccountsResponse(
      entity.model.accountId,
      entity.model.phone,
      entity.model.name,
      entity.model.surname,
      entity.model.accountType,
      entity.model.isVerified,
    );
  }

  public static fromEntities(entities: AccountEntity[]): AccountsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
