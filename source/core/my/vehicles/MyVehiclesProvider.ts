import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { VehicleType } from "../../../common/enums/VehicleType";
import { VehicleModel } from "../../../common/models/VehicleModel";
import { VehicleViewModel } from "../../../common/models/VehicleViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { VehicleQueries } from "../../../common/queries/VehicleQueries";
import { VehicleViewQueries } from "../../../common/queries/VehicleViewQueries";

export class MyVehiclesProvider implements IProvider {
  public constructor(
    private readonly itemProvider = new ItemProvider(),
    private readonly itemMediaProvider = new ItemMediaProvider(),
    private readonly mediaProvider = new MediaProvider(),
  ) {
    this.partialCreateItem = this.itemProvider.partialCreateItem.bind(this.itemProvider);
    this.partialUpdateItem = this.itemProvider.partialUpdateItem.bind(this.itemProvider);
    this.partialDeleteItem = this.itemProvider.partialDeleteItem.bind(this.itemProvider);
    this.getItemMedias = this.itemMediaProvider.getItemMedias.bind(this.itemMediaProvider);
    this.partialCreateItemMedias = this.itemMediaProvider.partialCreateItemMedias.bind(
      this.itemMediaProvider,
    );
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
    this.getMyMedias = this.mediaProvider.getMyMedias.bind(this.mediaProvider);
  }

  public partialCreateItem: typeof this.itemProvider.partialCreateItem;
  public partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  public partialDeleteItem: typeof this.itemProvider.partialDeleteItem;
  public getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  public partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;
  public getMyMedias: typeof this.mediaProvider.getMyMedias;

  public async getMyVehicles(accountId: number): Promise<ProviderResponse<VehicleViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLES_$ACID, [
        accountId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(VehicleViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyVehicle(
    accountId: number,
    vehicleId: number,
  ): Promise<ProviderResponse<VehicleViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(
        await this.partialGetMyVehicle(accountId, vehicleId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createVehicle(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    brand: string | null,
    model: string | null,
    vehicleType: VehicleType | null,
  ): Promise<ProviderResponse<VehicleViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateItem(accountId, name, description);
      const vehicle = await this.partialCreateVehicle(item.itemId, brand, model, vehicleType);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const vehicleView = await this.partialGetMyVehicle(accountId, vehicle.vehicleId);
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
    accountId: number,
    oldMediaIds: number[],
    vehicleId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    brand: string | null,
    model: string | null,
    vehicleType: VehicleType | null,
  ): Promise<ProviderResponse<VehicleViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateVehicle(vehicleId, brand, model, vehicleType);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const vehicleView = await this.partialGetMyVehicle(accountId, vehicleId);
      if (vehicleView === null) {
        throw new UnexpectedDatabaseStateError("Vehicle was not updated");
      }
      return await ResponseUtil.providerResponse(vehicleView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteVehicle(
    itemId: number,
    vehicleId: number,
    mediaIds: number[],
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteVehicle(vehicleId);
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialDeleteItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyVehicle(
    accountId: number,
    vehicleId: number,
  ): Promise<VehicleViewModel | null> {
    const results = await DbConstants.POOL.query(VehicleViewQueries.GET_VEHICLE_$ACID_$VHID, [
      accountId,
      vehicleId,
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
    vehicleType: VehicleType | null,
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
    vehicleType: VehicleType | null,
  ): Promise<VehicleModel> {
    const results = await DbConstants.POOL.query(
      VehicleQueries.UPDATE_VEHICLE_RT_$CPID_$BRAND_$MODEL_$VHTP,
      [vehicleId, brand, model, vehicleType],
    );
    const record: unknown = results.rows[0];
    return VehicleModel.fromRecord(record);
  }

  private async partialDeleteVehicle(vehicleId: number): Promise<void> {
    await DbConstants.POOL.query(VehicleQueries.DELETE_VEHICLE_$VHID, [vehicleId]);
  }
}
