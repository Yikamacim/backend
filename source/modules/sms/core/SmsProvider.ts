import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedQueryResultError } from "../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { VerificationModel } from "../../../common/models/VerificationModel";
import { VerificationQueries } from "../../../common/queries/VerificationQueries";
import type { VerificationData } from "../@types/verification";

export class SmsProvider implements IProvider {
  public async createOrUpdateVerification(
    verificationData: VerificationData,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VerificationQueries.GET_VERIFICATION_$PHONE, [
        verificationData.phone,
      ]);
      const record: unknown = results.rows[0];
      // There is not a record
      if (!record) {
        await this.partialCreateVerification(verificationData);
        return await ResponseUtil.providerResponse(null);
      }
      // There is a record, update it
      await this.partialUpdateVerification(verificationData);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getVerification(phone: string): Promise<ProviderResponse<VerificationModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VerificationQueries.GET_VERIFICATION_$PHONE, [
        phone,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        throw new UnexpectedQueryResultError();
      }
      return await ResponseUtil.providerResponse(VerificationModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateVerification(verificationData: VerificationData): Promise<void> {
    const sessionResults = await DbConstants.POOL.query(
      VerificationQueries.INSERT_VERIFICATION_RT_$PHONE_$CODE_$SENTAT,
      [verificationData.phone, verificationData.code, verificationData.sentAt],
    );
    const record: unknown = sessionResults.rows[0];
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
  }

  private async partialUpdateVerification(verificationData: VerificationData): Promise<void> {
    await DbConstants.POOL.query(VerificationQueries.UPDATE_VERIFICATION_RT_$PHONE_$CODE_$SENTAT, [
      verificationData.phone,
      verificationData.code,
      verificationData.sentAt,
    ]);
  }
}
