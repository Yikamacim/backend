import type { IProvider } from "../../../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../../../common/providers/BusinessProvider";
import { OrderProvider } from "../../../../../common/providers/OrderProvider";

export class MyBusinessOrdersCancelProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly orderProvider = new OrderProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getBusinessOrder = this.orderProvider.getBusinessOrder.bind(this.orderProvider);
    this.cancelOrder = this.orderProvider.cancelOrder.bind(this.orderProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getBusinessOrder: typeof this.orderProvider.getBusinessOrder;
  public readonly cancelOrder: typeof this.orderProvider.cancelOrder;
}
