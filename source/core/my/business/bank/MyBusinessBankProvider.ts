import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BankAccountModel } from "../../../../common/models/BankAccountModel";
import { BankAccountProvider } from "../../../../common/providers/BankAccountProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BankAccountQueries } from "../../../../common/queries/BankAccountQueries";

export class MyBusinessBankProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    public readonly bankAccountProvider = new BankAccountProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getBankAccount = this.bankAccountProvider.getBankAccount.bind(this.bankAccountProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getBankAccount: typeof this.bankAccountProvider.getBankAccount;

  public async createBankAccount(
    businessId: number,
    owner: string,
    iban: string,
  ): Promise<ProviderResponse<BankAccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BankAccountQueries.INSERT_BANK_ACCOUNT_$BSID_$OWNER_$IBAN,
        [businessId, owner, iban],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(BankAccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateBankAccount(
    businessId: number,
    owner: string,
    iban: string,
  ): Promise<ProviderResponse<BankAccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BankAccountQueries.UPDATE_BANK_ACCOUNT_RT_$BSID_$OWNER_$IBAN_$BLCH,
        [businessId, owner, iban, 0],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(BankAccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
