import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { BusinessAreaViewModel } from "../models/BusinessAreaViewModel";
import { BusinessAreaViewQueries } from "../queries/BusinessAreaViewQueries";

export class BusinessAreaProvider implements IProvider {
  public async getBusinessAreas(
    businessId: number,
  ): Promise<ProviderResponse<BusinessAreaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BusinessAreaViewQueries.GET_BUSINESS_AREAS_$BSID,
        [businessId],
      );
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BusinessAreaViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
