import type { IProvider } from "../../../app/interfaces/IProvider";
import { ApprovalMediaProvider } from "../../../common/providers/ApprovalMediaProvider";
import { ApprovalProvider } from "../../../common/providers/ApprovalProvider";

export class AdminApprovalsProvider implements IProvider {
  public constructor(
    private readonly approvalProvider = new ApprovalProvider(),
    private readonly approvalMediaProvider = new ApprovalMediaProvider(),
  ) {
    this.getPendingApprovals = this.approvalProvider.getPendingApprovals.bind(
      this.approvalProvider,
    );
    this.getApproval = this.approvalProvider.getApproval.bind(this.approvalProvider);
    this.updateApproval = this.approvalProvider.updateApproval.bind(this.approvalProvider);
    this.getApprovalMedias = this.approvalMediaProvider.getApprovalMedias.bind(
      this.approvalMediaProvider,
    );
  }

  public readonly getPendingApprovals: typeof this.approvalProvider.getPendingApprovals;
  public readonly getApproval: typeof this.approvalProvider.getApproval;
  public readonly updateApproval: typeof this.approvalProvider.updateApproval;
  public readonly getApprovalMedias: typeof this.approvalMediaProvider.getApprovalMedias;
}
