import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../common/enums/EOrderState";
import { OrderHelper } from "../../../../common/helpers/OrderHelper";
import { MyOrdersCompleteProvider } from "./MyOrdersCompleteProvider";
import type { MyOrdersCompleteParams } from "./schemas/MyOrdersCompleteParams";
import type { MyOrdersCompleteRequest } from "./schemas/MyOrdersCompleteRequest";
import { MyOrdersCompleteResponse } from "./schemas/MyOrdersCompleteResponse";

export class MyOrdersCompleteManager implements IManager {
  public constructor(private readonly provider = new MyOrdersCompleteProvider()) {}

  public async putMyOrdersComplete(
    payload: TokenPayload,
    params: MyOrdersCompleteParams,
    request: MyOrdersCompleteRequest,
  ): Promise<ManagerResponse<MyOrdersCompleteResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    if (order.orderState !== EOrderState.OFFERED || order.price === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.ORDER_CANNOT_BE_COMPLETED)],
        null,
      );
    }
    const card = await this.provider.getMyActiveCard(payload.accountId, request.cardId);
    if (card === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_CARD_WITH_THIS_ID)],
        null,
      );
    }
    // complete order and pay to business
    const updatedOrder = await this.provider.completeOrder(
      order.orderId,
      order.businessId,
      order.price,
    );
    const entityResult = await OrderHelper.orderToEntity(updatedOrder);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyOrdersCompleteResponse.fromEntity(entity),
    );
  }
}
