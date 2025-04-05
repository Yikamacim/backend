import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ProvinceModel } from "../../common/models/ProvinceModel";
import { ProvinceQueries } from "../../common/queries/ProvinceQueries";

export class ProvincesProvider implements IProvider {
  public async getProvincesByCountryId(
    countryId: number,
  ): Promise<ProviderResponse<ProvinceModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ProvinceQueries.GET_PROVINCES_$CNID, [
        countryId,
      ]);
      const records: unknown[] = results.rows;
      if (!records) {
        return await ResponseUtil.providerResponse([]);
      }
      return await ResponseUtil.providerResponse(ProvinceModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getProvinceById(
    provinceId: number,
  ): Promise<ProviderResponse<ProvinceModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ProvinceQueries.GET_PROVINCE_$PVID, [
        provinceId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(ProvinceModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
