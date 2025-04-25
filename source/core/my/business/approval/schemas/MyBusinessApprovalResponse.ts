import type { MediaData } from "../../../../../@types/medias";
import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { ApprovalState } from "../../../../../common/enums/ApprovalState";
import type { ApprovalModel } from "../../../../../common/models/ApprovalModel";

export class MyBusinessApprovalResponse implements IResponse {
  private constructor(
    public readonly businessId: number,
    public readonly medias: MediaData[],
    public readonly message: string | null,
    public readonly approvalState: ApprovalState,
    public readonly reason: string | null,
    public readonly createdAt: Date,
  ) {}

  public static fromModel(model: ApprovalModel, medias: MediaData[]): MyBusinessApprovalResponse {
    return new MyBusinessApprovalResponse(
      model.businessId,
      medias,
      model.message,
      model.approvalState,
      model.reason,
      model.createdAt,
    );
  }
}
