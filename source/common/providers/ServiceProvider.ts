import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ServiceModel } from "../models/ServiceModel";
import { ServiceQueries } from "../queries/ServiceQueries";

export class ServiceProvider implements IProvider {
  public async getActiveServices(businessId: number): Promise<ProviderResponse<ServiceModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ServiceQueries.GET_SERVICES_$BSID_$ISDEL, [
        businessId,
        false,
      ]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ServiceModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
