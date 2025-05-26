import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { SessionEntity } from "../../../../common/entities/SessionEntity";

export class MySessionsResponse implements IResponse {
  private constructor(
    public readonly sessionId: number,
    public readonly deviceName: string,
    public readonly lastActivityDate: Date,
    public readonly isCurrent: boolean,
  ) {}

  public static fromEntity(entity: SessionEntity): MySessionsResponse {
    return new MySessionsResponse(
      entity.model.sessionId,
      entity.model.deviceName,
      entity.model.lastActivityDate,
      entity.isCurrent,
    );
  }

  public static fromEntities(entities: SessionEntity[]): MySessionsResponse[] {
    return entities.map((entity) => MySessionsResponse.fromEntity(entity));
  }
}
