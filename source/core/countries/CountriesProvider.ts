import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CountryModel } from "../../common/models/CountryModel";
import { CountryQueries } from "../../common/queries/CountryQueries";

export class CountriesProvider implements IProvider {
  public async getCountries(): Promise<ProviderResponse<CountryModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CountryQueries.GET_COUNTRIES);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CountryModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getCountry(countryId: number): Promise<ProviderResponse<CountryModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CountryQueries.GET_COUNTRY_$CNID, [countryId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(CountryModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
