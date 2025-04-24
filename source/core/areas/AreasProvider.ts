import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AreaViewModel } from "../../common/models/AreaViewModel";
import { AreaViewQueries } from "../../common/queries/AreaViewQueries";

export class AreasProvider implements IProvider {
  public async searchAreas(query: string): Promise<ProviderResponse<AreaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AreaViewQueries.SEARCH_AREA_$QUERY, [query]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(AreaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
