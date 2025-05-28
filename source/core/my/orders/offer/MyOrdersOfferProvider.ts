import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../common/enums/EOrderState";
import type { OrderViewModel } from "../../../../common/models/OrderViewModel";
import { OrderProvider } from "../../../../common/providers/OrderProvider";

export class MyOrdersOfferProvider implements IProvider {
  public constructor(private readonly orderProvider = new OrderProvider()) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
    this.partialGetOrder = this.orderProvider.partialGetOrder.bind(this.orderProvider);
    this.partialUpdateOffer = this.orderProvider.partialUpdateOrder.bind(this.orderProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;
  private readonly partialGetOrder: typeof this.orderProvider.partialGetOrder;

  private readonly partialUpdateOffer: typeof this.orderProvider.partialUpdateOrder;

  public async declineOffer(orderId: number): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const order = await this.partialUpdateOffer(orderId, EOrderState.PENDING, null);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new Error("Order was not declined");
      }
      return await ResponseUtil.providerResponse(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
