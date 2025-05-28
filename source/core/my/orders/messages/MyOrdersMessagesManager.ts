import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { MessageEntity } from "../../../../common/entities/MessageEntity";
import { MyOrdersMessagesProvider } from "./MyOrdersMessagesProvider";
import type { MyOrdersMessagesParams } from "./schemas/MyOrdersMessagesParams";
import type { MyOrdersMessagesRequest } from "./schemas/MyOrdersMessagesRequest";
import { MyOrdersMessagesResponse } from "./schemas/MyOrdersMessagesResponse";

export class MyOrdersMessagesManager implements IManager {
  public constructor(private readonly provider = new MyOrdersMessagesProvider()) {}

  public async getMyOrdersMessages(
    payload: TokenPayload,
    params: MyOrdersMessagesParams,
  ): Promise<ManagerResponse<MyOrdersMessagesResponse[] | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    const messages = await this.provider.getMessages(order.orderId);
    const entities = messages.map((message) => new MessageEntity(message));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersMessagesResponse.fromEntities(entities),
    );
  }

  public async postMyOrdersMessages(
    payload: TokenPayload,
    params: MyOrdersMessagesParams,
    request: MyOrdersMessagesRequest,
  ): Promise<ManagerResponse<MyOrdersMessagesResponse[] | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    await this.provider.createMessage(order.orderId, false, request.content);
    const messages = await this.provider.getMessages(order.orderId);
    const entities = messages.map((message) => new MessageEntity(message));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyOrdersMessagesResponse.fromEntities(entities),
    );
  }
}
