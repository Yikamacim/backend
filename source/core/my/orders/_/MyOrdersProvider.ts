import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { OrderModel } from "../../../../common/models/OrderModel";
import { OrderViewModel } from "../../../../common/models/OrderViewModel";
import { AddressProvider } from "../../../../common/providers/AddressProvider";
import { BusinessAreaProvider } from "../../../../common/providers/BusinessAreaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { MessageProvider } from "../../../../common/providers/MessageProvider";
import { OrderProvider } from "../../../../common/providers/OrderProvider";
import { ServiceProvider } from "../../../../common/providers/ServiceProvider";
import { OrderItemQueries } from "../../../../common/queries/OrderItemQueries";
import { OrderQueries } from "../../../../common/queries/OrderQueries";
import { OrderViewQueries } from "../../../../common/queries/OrderViewQueries";

export class MyOrdersProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly messageProvider = new MessageProvider(),
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessAreaProvider = new BusinessAreaProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly addressProvider = new AddressProvider(),
  ) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
    this.createMessage = this.messageProvider.createMessage.bind(this.messageProvider);
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getBusinessAreas = this.businessAreaProvider.getBusinessAreas.bind(
      this.businessAreaProvider,
    );
    this.getActiveService = this.serviceProvider.getActiveService.bind(this.serviceProvider);
    this.getMyActiveAddress = this.addressProvider.getMyActiveAddress.bind(this.addressProvider);
    this.partialGetOrder = this.orderProvider.partialGetOrder.bind(this.orderProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;
  public readonly createMessage: typeof this.messageProvider.createMessage;
  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getBusinessAreas: typeof this.businessAreaProvider.getBusinessAreas;
  public readonly getActiveService: typeof this.serviceProvider.getActiveService;
  public readonly getMyActiveAddress: typeof this.addressProvider.getMyActiveAddress;

  private readonly partialGetOrder: typeof this.orderProvider.partialGetOrder;

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

  public async createMyOrder(
    serviceId: number,
    addressId: number,
    accountId: number,
    itemIds: number[],
  ): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const order = await this.partialCreateMyOrder(serviceId, addressId, accountId);
      await this.partialCreateOrderItems(order.orderId, itemIds);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new UnexpectedDatabaseStateError("Prder was not created");
      }
      return await ResponseUtil.providerResponse(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialCreateMyOrder(
    serviceId: number,
    addressId: number,
    accountId: number,
  ): Promise<OrderModel> {
    const results = await DbConstants.POOL.query(OrderQueries.INSERT_ORDER_RT_$SVID_$ADID_$ACID, [
      serviceId,
      addressId,
      accountId,
    ]);
    const record: unknown = results.rows[0];
    return OrderModel.fromRecord(record);
  }

  private async partialCreateOrderItems(orderId: number, itemIds: number[]): Promise<void> {
    for (const itemId of itemIds) {
      await DbConstants.POOL.query(OrderItemQueries.INSERT_ORDER_ITEM_$ORID_$ITID, [
        orderId,
        itemId,
      ]);
    }
  }
}
