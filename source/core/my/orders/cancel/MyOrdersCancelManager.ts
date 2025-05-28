import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../common/enums/EOrderState";
import { OrderHelper } from "../../../../common/helpers/OrderHelper";
import { MyOrdersCancelProvider } from "./MyOrdersCancelProvider";
import type { MyOrdersCancelParams } from "./schemas/MyOrdersCancelParams";
import { MyOrdersCancelResponse } from "./schemas/MyOrdersCancelResponse";

export class MyOrdersCancelManager implements IManager {
  public constructor(private readonly provider = new MyOrdersCancelProvider()) {}

  public async putMyOrdersCancel(
    payload: TokenPayload,
    params: MyOrdersCancelParams,
  ): Promise<ManagerResponse<MyOrdersCancelResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    if (order.orderState !== EOrderState.PENDING) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.ORDER_CANNOT_BE_CANCELED)],
        null,
      );
    }
    const updatedOrder = await this.provider.cancelOrder(order.orderId);
    const entityResult = await OrderHelper.orderToEntity(updatedOrder);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersCancelResponse.fromEntity(entity),
    );
  }
}
