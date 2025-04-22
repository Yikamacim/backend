import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { BusinessViewModel } from "../models/BusinessViewModel";
import { BusinessViewQueries } from "../queries/BusinessViewQueries";

export class BusinessProvider implements IProvider {
  public async getMyBusiness(
    accountId: number,
  ): Promise<ProviderResponse<BusinessViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyBusiness(accountId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialGetMyBusiness(accountId: number): Promise<BusinessViewModel | null> {
    const results = await DbConstants.POOL.query(BusinessViewQueries.GET_BUSINESS_$ACID, [
      accountId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return await ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(BusinessViewModel.fromRecord(record));
  }
}
