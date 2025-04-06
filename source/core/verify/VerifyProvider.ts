import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountProvider } from "../../common/providers/AccountProvider";
import { VerificationProvider } from "../../common/providers/VerificationProvider";
import { AccountQueries } from "../../common/queries/AccountQueries";

export class VerifyProvider implements IProvider {
  public constructor(
    private readonly accountProvider = new AccountProvider(),
    private readonly verificationProvider = new VerificationProvider(),
  ) {
    this.getAccount = this.accountProvider.getAccountByPhone.bind(this.accountProvider);
    this.getVerification = this.verificationProvider.getVerification.bind(
      this.verificationProvider,
    );
  }

  public getAccount: typeof this.accountProvider.getAccountByPhone;
  public getVerification: typeof this.verificationProvider.getVerification;

  public async verifyAccount(accountId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(AccountQueries.VERIFY_ACCOUNT_RT_$ACID, [accountId]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
