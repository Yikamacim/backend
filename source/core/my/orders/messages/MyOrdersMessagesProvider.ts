import type { IProvider } from "../../../../app/interfaces/IProvider";
import { MessageProvider } from "../../../../common/providers/MessageProvider";
import { OrderProvider } from "../../../../common/providers/OrderProvider";

export class MyOrdersMessagesProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly messageProvider = new MessageProvider(),
  ) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
    this.getMessages = this.messageProvider.getMessages.bind(this.messageProvider);
    this.createMessage = this.messageProvider.createMessage.bind(this.messageProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;
  public readonly getMessages: typeof this.messageProvider.getMessages;
  public readonly createMessage: typeof this.messageProvider.createMessage;
}
