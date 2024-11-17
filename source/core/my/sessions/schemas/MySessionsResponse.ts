import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { SessionModel } from "../../../../common/models/SessionModel";

export class MySessionsResponse implements IResponse {
  private constructor(
    public readonly sessionId: number,
    public readonly deviceName: string,
    public readonly lastActivityDate: Date,
    public readonly isCurrent: boolean,
  ) {}

  public static fromModel(model: SessionModel, currentSessionId: number): MySessionsResponse {
    return new MySessionsResponse(
      model.sessionId,
      model.deviceName,
      model.lastActivityDate,
      model.sessionId === currentSessionId,
    );
  }

  public static fromModels(models: SessionModel[], currentSessionId: number): MySessionsResponse[] {
    return models.map((model: SessionModel) =>
      MySessionsResponse.fromModel(model, currentSessionId),
    );
  }
}
