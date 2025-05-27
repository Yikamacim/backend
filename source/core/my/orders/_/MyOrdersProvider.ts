import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { OrderViewModel } from "../../../../common/models/OrderViewModel";
import { AddressProvider } from "../../../../common/providers/AddressProvider";
import { BusinessAreaProvider } from "../../../../common/providers/BusinessAreaProvider";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { HoursProvider } from "../../../../common/providers/HoursProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { ServiceProvider } from "../../../../common/providers/ServiceProvider";
import { OrderViewQueries } from "../../../../common/queries/OrderViewQueries";

export class MyOrdersProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly businessAreaProvider = new BusinessAreaProvider(),
    private readonly hoursProvider = new HoursProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly mediaProvider = new MediaProvider(),
    private readonly addressProvider = new AddressProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.getBusinessAreas = this.businessAreaProvider.getBusinessAreas.bind(
      this.businessAreaProvider,
    );
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
    this.getActiveService = this.serviceProvider.getActiveService.bind(this.serviceProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getMyActiveAddress = this.addressProvider.getMyActiveAddress.bind(this.addressProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;
  public readonly getBusinessAreas: typeof this.businessAreaProvider.getBusinessAreas;
  public readonly getHours: typeof this.hoursProvider.getHours;
  public readonly getActiveService: typeof this.serviceProvider.getActiveService;
  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getMyActiveAddress: typeof this.addressProvider.getMyActiveAddress;

  public async getMyOrders(accountId: number): Promise<ProviderResponse<OrderViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDERS_$ACID, [accountId]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyOrder(
    accountId: number,
    orderId: number,
  ): Promise<ProviderResponse<OrderViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDER_$ACID_$ORID, [
        accountId,
        orderId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMyOrder(
    serviceId: number,
    addressId: number,
    accountId: number,
  ): Promise<ProviderResponse<OrderViewModel>> {}
}
