import type { ManagerResponse } from "../../../../../@types/responses";
import type { TokenPayload } from "../../../../../@types/tokens";
import type { IManager } from "../../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { MessageEntity } from "../../../../../common/entities/MessageEntity";
import { MyBusinessOrdersMessagesProvider } from "./MyBusinessOrdersMessagesProvider";
import type { MyBusinessOrdersMessagesParams } from "./schemas/MyBusinessOrdersMessagesParams";
import type { MyBusinessOrdersMessagesRequest } from "./schemas/MyBusinessOrdersMessagesRequest";
import { MyBusinessOrdersMessagesResponse } from "./schemas/MyBusinessOrdersMessagesResponse";

export class MyBusinessOrdersMessagesManager implements IManager {
  public constructor(private readonly provider = new MyBusinessOrdersMessagesProvider()) {}

  public async getMyBusinessOrdersMessages(
    payload: TokenPayload,
    params: MyBusinessOrdersMessagesParams,
  ): Promise<ManagerResponse<MyBusinessOrdersMessagesResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const order = await this.provider.getBusinessOrder(
      business.businessId,
      parseInt(params.orderId),
    );
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    const messages = await this.provider.getMessages(order.orderId);
    const entities = messages.map((message) => new MessageEntity(message));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOrdersMessagesResponse.fromEntities(entities),
    );
  }

  public async postMyBusinessOrdersMessages(
    payload: TokenPayload,
    params: MyBusinessOrdersMessagesParams,
    request: MyBusinessOrdersMessagesRequest,
  ): Promise<ManagerResponse<MyBusinessOrdersMessagesResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const order = await this.provider.getBusinessOrder(
      business.businessId,
      parseInt(params.orderId),
    );
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    await this.provider.createMessage(order.orderId, true, request.content);
    const messages = await this.provider.getMessages(order.orderId);
    const entities = messages.map((message) => new MessageEntity(message));
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessOrdersMessagesResponse.fromEntities(entities),
    );
  }
}
