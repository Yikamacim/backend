import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighbourhoodModel } from "../../common/models/NeighbourhoodModel";
import { NeighbourhoodQueries } from "../../common/queries/NeighbourhoodQueries";

export class NeighbourhoodsProvider implements IProvider {
  public async getNeighbourhoodsByDistrictId(
    districtId: number,
  ): Promise<ProviderResponse<NeighbourhoodModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(NeighbourhoodQueries.GET_NEIGHBOURHOODS_$DSID, [
        districtId,
      ]);
      const records: unknown[] = results.rows;
      if (!records) {
        return await ResponseUtil.providerResponse([]);
      }
      return await ResponseUtil.providerResponse(
        records.map((record: unknown) => NeighbourhoodModel.fromRecord(record)),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getNeighbourhoodById(
    neighbourhoodId: number,
  ): Promise<ProviderResponse<NeighbourhoodModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(NeighbourhoodQueries.GET_NEIGHBOURHOOD_$NBID, [
        neighbourhoodId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(NeighbourhoodModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
