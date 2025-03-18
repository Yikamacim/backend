import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { DateUtil } from "../../app/utils/DateUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { VerificationModel } from "../../common/models/VerificationModel";
import { AccountProvider } from "../../common/providers/AccountProvider";
import { AccountQueries } from "../../common/queries/AccountQueries";
import { VerificationQueries } from "../../common/queries/VerificationQueries";
import { SmsConstants } from "../../modules/sms/app/constants/SmsConstants";

export class VerifyProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccount = this.accountProvider.getAccountByPhone.bind(this.accountProvider);
  }

  public getAccount: typeof this.accountProvider.getAccountByPhone;

  public async verifyAccount(accountId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.VERIFY_ACCOUNT_RT_$ACID, [
        accountId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        throw new UnexpectedQueryResultError();
      }
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async isCodeExpired(phone: string): Promise<ProviderResponse<boolean>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VerificationQueries.GET_VERIFICATION_$PHONE, [
        phone,
      ]);
      const record: unknown = results.rows[0];
      // There is not a record
      if (!record) {
        return await ResponseUtil.providerResponse(true);
      }
      const verification = VerificationModel.fromRecord(record);
      // There is a record, check expiration
      if (DateUtil.isExpired(verification.sentAt, SmsConstants.SMS_CODE_EXPIRATION_TIME)) {
        return await ResponseUtil.providerResponse(true);
      }
      return await ResponseUtil.providerResponse(false);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
