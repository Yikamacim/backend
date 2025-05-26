import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ApprovalEntity } from "../../../../../common/entities/ApprovalEntity";
import type { EApprovalState } from "../../../../../common/enums/EApprovalState";
import type { EMediaType } from "../../../../../common/enums/EMediaType";

export class MyBusinessApprovalResponse implements IResponse {
  private constructor(
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly message: string | null,
    public readonly approvalState: EApprovalState,
    public readonly reason: string | null,
    public readonly createdAt: Date,
  ) {}

  public static fromEntity(entity: ApprovalEntity): MyBusinessApprovalResponse {
    return new MyBusinessApprovalResponse(
      entity.medias,
      entity.model.message,
      entity.model.approvalState,
      entity.model.reason,
      entity.model.createdAt,
    );
  }

  public static fromEntities(entities: ApprovalEntity[]): MyBusinessApprovalResponse[] {
    return entities.map((entity) => MyBusinessApprovalResponse.fromEntity(entity));
  }
}
