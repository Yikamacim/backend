import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DistrictModel } from "../../common/models/DistrictModel";
import { DistrictQueries } from "../../common/queries/DistrictQueries";

export class DistrictsProvider implements IProvider {
  public async getDistrictsByProvinceId(
    provinceId: number,
  ): Promise<ProviderResponse<DistrictModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(DistrictQueries.GET_DISTRICTS_$PVID, [
        provinceId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(DistrictModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getDistrictById(
    districtId: number,
  ): Promise<ProviderResponse<DistrictModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(DistrictQueries.GET_DISTRICT_$DSID, [
        districtId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(DistrictModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
