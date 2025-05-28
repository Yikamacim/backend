import type { ProviderResponse } from "../../../../../@types/responses";
import { DbConstants } from "../../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../../common/enums/EOrderState";
import type { OrderViewModel } from "../../../../../common/models/OrderViewModel";
import { BusinessProvider } from "../../../../../common/providers/BusinessProvider";
import { MessageProvider } from "../../../../../common/providers/MessageProvider";
import { OrderProvider } from "../../../../../common/providers/OrderProvider";

export class MyBusinessOrdersOfferProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly messageProvider = new MessageProvider(),
    private readonly businessProvider = new BusinessProvider(),
  ) {
    this.getBusinessOrder = this.orderProvider.getBusinessOrder.bind(this.orderProvider);
    this.createMessage = this.messageProvider.createMessage.bind(this.messageProvider);
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.partialGetOrder = this.orderProvider.partialGetOrder.bind(this.orderProvider);
    this.partialUpdateOffer = this.orderProvider.partialUpdateOrder.bind(this.orderProvider);
  }

  public readonly getBusinessOrder: typeof this.orderProvider.getBusinessOrder;
  public readonly createMessage: typeof this.messageProvider.createMessage;
  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;

  private readonly partialGetOrder: typeof this.orderProvider.partialGetOrder;
  private readonly partialUpdateOffer: typeof this.orderProvider.partialUpdateOrder;

  public async makeOffer(
    orderId: number,
    price: number,
  ): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const order = await this.partialUpdateOffer(orderId, EOrderState.OFFERED, price);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new Error("Order was not cancelled");
      }
      return await ResponseUtil.providerResponse(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async withdrawOffer(orderId: number): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const order = await this.partialUpdateOffer(orderId, EOrderState.PENDING, null);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new Error("Order was not cancelled");
      }
      return await ResponseUtil.providerResponse(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
