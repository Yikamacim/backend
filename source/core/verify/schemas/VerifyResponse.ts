import type { IResponse } from "../../../app/interfaces/IResponse";
import type { AccountEntity } from "../../../common/entities/AccountEntity";
import type { EAccountType } from "../../../common/enums/EAccountType";

export class VerifyResponse implements IResponse {
  private constructor(
    public readonly accountId: number,
    public readonly phone: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: EAccountType,
    public readonly isVerified: boolean,
  ) {}

  public static fromEntity(entity: AccountEntity): VerifyResponse {
    return new VerifyResponse(
      entity.model.accountId,
      entity.model.phone,
      entity.model.name,
      entity.model.surname,
      entity.model.accountType,
      entity.model.isVerified,
    );
  }

  public static fromEntities(entities: AccountEntity[]): VerifyResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
