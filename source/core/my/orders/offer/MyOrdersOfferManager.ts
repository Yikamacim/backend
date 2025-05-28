import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../common/enums/EOrderState";
import { OrderHelper } from "../../../../common/helpers/OrderHelper";
import { MyOrdersOfferProvider } from "./MyOrdersOfferProvider";
import type { MyOrdersOfferParams } from "./schemas/MyOrdersOfferParams";
import { MyOrdersOfferResponse } from "./schemas/MyOrdersOfferResponse";

export class MyOrdersOfferManager implements IManager {
  public constructor(private readonly provider = new MyOrdersOfferProvider()) {}

  public async deleteMyOrdersOffer(
    payload: TokenPayload,
    params: MyOrdersOfferParams,
  ): Promise<ManagerResponse<MyOrdersOfferResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    if (order.orderState !== EOrderState.OFFERED) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.ORDER_CANNOT_BE_DECLINED)],
        null,
      );
    }
    const updatedOrder = await this.provider.declineOffer(order.orderId);
    const entityResult = await OrderHelper.orderToEntity(updatedOrder);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();

    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyOrdersOfferResponse.fromEntity(entity),
    );
  }
}
