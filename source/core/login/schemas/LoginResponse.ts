import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountEntity } from "../../../common/entities/AccountEntity";
import type { EAccountType } from "../../../common/enums/EAccountType";

export class LoginResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: EAccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromEntity(entity: AccountEntity): LoginResponse {
    return new LoginResponse(
      entity.model.accountId,
      entity.model.phone,
      entity.model.name,
      entity.model.surname,
      entity.model.accountType,
      entity.model.isVerified,
    );
  }

  public static fromEntities(entities: AccountEntity[]): LoginResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
