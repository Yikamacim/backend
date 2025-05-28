import type { IProvider } from "../../../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../../../common/providers/BusinessProvider";
import { MessageProvider } from "../../../../../common/providers/MessageProvider";
import { OrderProvider } from "../../../../../common/providers/OrderProvider";

export class MyBusinessOrdersMessagesProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly messageProvider = new MessageProvider(),
    private readonly businessProvider = new BusinessProvider(),
  ) {
    this.getBusinessOrder = this.orderProvider.getBusinessOrder.bind(this.orderProvider);
    this.getMessages = this.messageProvider.getMessages.bind(this.messageProvider);
    this.createMessage = this.messageProvider.createMessage.bind(this.messageProvider);
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
  }

  public readonly getBusinessOrder: typeof this.orderProvider.getBusinessOrder;
  public readonly getMessages: typeof this.messageProvider.getMessages;
  public readonly createMessage: typeof this.messageProvider.createMessage;
  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
}
