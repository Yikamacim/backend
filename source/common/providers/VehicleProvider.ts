import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { VehicleViewModel } from "../models/VehicleViewModel";
import { VehicleViewQueries } from "../queries/VehicleViewQueries";

export class VehicleProvider implements IProvider {
  public async getMyVehicle(
    accountId: number,
    vehicleId: number,
  ): Promise<ProviderResponse<VehicleViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLE_$ACID_$VHID, [
        accountId,
        vehicleId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return VehicleViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getVehicleByItemId(
    itemId: number,
  ): Promise<ProviderResponse<VehicleViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLE_$ITID, [itemId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return VehicleViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
