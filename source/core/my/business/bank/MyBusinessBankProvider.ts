import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BankModel } from "../../../../common/models/BankModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BankQueries } from "../../../../common/queries/BankQueries";

export class MyBusinessBankProvider implements IProvider {
  public constructor(private readonly businessProvider = new BusinessProvider()) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;

  public async getMyBusinessBank(businessId: number): Promise<ProviderResponse<BankModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BankQueries.GET_BANK_$BSID, [businessId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(BankModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBusinessBank(
    businessId: number,
    owner: string,
    iban: string,
  ): Promise<ProviderResponse<BankModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(BankQueries.INSERT_BANK_$BSID_$OWNER_$IBAN, [
        businessId,
        owner,
        iban,
      ]);
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(BankModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateBusinessBank(
    businessId: number,
    owner: string,
    iban: string,
  ): Promise<ProviderResponse<BankModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BankQueries.UPDATE_BANK_$BSID_$OWNER_$IBAN_$BLCH,
        [businessId, owner, iban, 0],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(BankModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
