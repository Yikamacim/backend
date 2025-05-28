import type { IProvider } from "../../../../app/interfaces/IProvider";
import { OrderProvider } from "../../../../common/providers/OrderProvider";

export class MyOrdersCancelProvider implements IProvider {
  public constructor(private readonly orderProvider = new OrderProvider()) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
    this.cancelOrder = this.orderProvider.cancelOrder.bind(this.orderProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;
  public readonly cancelOrder: typeof this.orderProvider.cancelOrder;
}
