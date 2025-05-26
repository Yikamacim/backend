import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { EVehicleType } from "../../../common/enums/EVehicleType";
import { VehicleModel } from "../../../common/models/VehicleModel";
import { VehicleViewModel } from "../../../common/models/VehicleViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { VehicleQueries } from "../../../common/queries/VehicleQueries";
import { VehicleViewQueries } from "../../../common/queries/VehicleViewQueries";

export class MyVehiclesProvider implements IProvider {
  public constructor(
    private readonly itemProvider = new ItemProvider(),
    private readonly itemMediaProvider = new ItemMediaProvider(),
  ) {
    this.partialCreateMyItem = this.itemProvider.partialCreateMyItem.bind(this.itemProvider);
    this.partialUpdateItem = this.itemProvider.partialUpdateItem.bind(this.itemProvider);
    this.archiveItem = this.itemProvider.archiveItem.bind(this.itemProvider);
    this.getItemMedias = this.itemMediaProvider.getItemMedias.bind(this.itemMediaProvider);
    this.partialCreateItemMedias = this.itemMediaProvider.partialCreateItemMedias.bind(
      this.itemMediaProvider,
    );
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
  }

  public readonly getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public readonly archiveItem: typeof this.itemProvider.archiveItem;

  private readonly partialCreateMyItem: typeof this.itemProvider.partialCreateMyItem;
  private readonly partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  private readonly partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  private readonly partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;

  public async getMyActiveVehicles(
    accountId: number,
  ): Promise<ProviderResponse<VehicleViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLES_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(VehicleViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveVehicle(
    accountId: number,
    vehicleId: number,
  ): Promise<ProviderResponse<VehicleViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        VehicleViewQueries.GET_VEHICLE_$ACID_$VHID_$ISDEL,
        [accountId, vehicleId, false],
      );
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

  public async createMyVehicle(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    brand: string | null,
    model: string | null,
    vehicleType: EVehicleType | null,
  ): Promise<ProviderResponse<VehicleViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateMyItem(accountId, name, description);
      const vehicle = await this.partialCreateVehicle(item.itemId, brand, model, vehicleType);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const vehicleView = await this.partialGetActiveVehicle(vehicle.vehicleId);
      if (vehicleView === null) {
        throw new UnexpectedDatabaseStateError("Vehicle was not created");
      }
      return await ResponseUtil.providerResponse(vehicleView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateVehicle(
    oldMediaIds: number[],
    vehicleId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    brand: string | null,
    model: string | null,
    vehicleType: EVehicleType | null,
  ): Promise<ProviderResponse<VehicleViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateVehicle(vehicleId, brand, model, vehicleType);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const vehicleView = await this.partialGetActiveVehicle(vehicleId);
      if (vehicleView === null) {
        throw new UnexpectedDatabaseStateError("Vehicle was not updated");
      }
      return await ResponseUtil.providerResponse(vehicleView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveVehicle(vehicleId: number): Promise<VehicleViewModel | null> {
    const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLE_$VHID_$ISDEL, [
      vehicleId,
      false,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return VehicleViewModel.fromRecord(record);
  }

  private async partialCreateVehicle(
    itemId: number,
    brand: string | null,
    model: string | null,
    vehicleType: EVehicleType | null,
  ): Promise<VehicleModel> {
    const results = await DbConstants.POOL.query(
      VehicleQueries.INSERT_VEHICLE_RT_$ITID_$BRAND_$MODEL_$VHTP,
      [itemId, brand, model, vehicleType],
    );
    const record: unknown = results.rows[0];
    return VehicleModel.fromRecord(record);
  }

  private async partialUpdateVehicle(
    vehicleId: number,
    brand: string | null,
    model: string | null,
    vehicleType: EVehicleType | null,
  ): Promise<VehicleModel> {
    const results = await DbConstants.POOL.query(
      VehicleQueries.UPDATE_VEHICLE_RT_$CPID_$BRAND_$MODEL_$VHTP,
      [vehicleId, brand, model, vehicleType],
    );
    const record: unknown = results.rows[0];
    return VehicleModel.fromRecord(record);
  }
}
