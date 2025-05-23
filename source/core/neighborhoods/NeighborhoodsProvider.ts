import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighborhoodModel } from "../../common/models/NeighborhoodModel";
import { NeighborhoodQueries } from "../../common/queries/NeighborhoodQueries";

export class NeighborhoodsProvider implements IProvider {
  public async getNeighborhoodsByDistrictId(
    districtId: number,
  ): Promise<ProviderResponse<NeighborhoodModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(NeighborhoodQueries.GET_NEIGHBORHOODS_$DSID, [
        districtId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(NeighborhoodModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getNeighborhood(
    neighborhoodId: number,
  ): Promise<ProviderResponse<NeighborhoodModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(NeighborhoodQueries.GET_NEIGHBORHOOD_$NBID, [
        neighborhoodId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(NeighborhoodModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
