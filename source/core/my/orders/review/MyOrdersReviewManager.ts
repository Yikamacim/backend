import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ReviewEntity } from "../../../../common/entities/ReviewEntity";
import { EOrderState } from "../../../../common/enums/EOrderState";
import { MyOrdersReviewProvider } from "./MyOrdersReviewProvider";
import type { MyOrdersReviewParams } from "./schemas/MyOrdersReviewParams";
import type { MyOrdersReviewRequest } from "./schemas/MyOrdersReviewRequest";
import { MyOrdersReviewResponse } from "./schemas/MyOrdersReviewResponse";

export class MyOrdersReviewManager implements IManager {
  public constructor(private readonly provider = new MyOrdersReviewProvider()) {}

  public async getMyOrdersReview(
    payload: TokenPayload,
    params: MyOrdersReviewParams,
  ): Promise<ManagerResponse<MyOrdersReviewResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    const review = await this.provider.getReviewByOrderId(order.orderId);
    if (review === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ORDER_HAS_NO_REVIEW)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersReviewResponse.fromEntity(new ReviewEntity(review)),
    );
  }

  public async postMyOrdersReview(
    payload: TokenPayload,
    params: MyOrdersReviewParams,
    request: MyOrdersReviewRequest,
  ): Promise<ManagerResponse<MyOrdersReviewResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    if (order.orderState !== EOrderState.COMPLETED) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.ORDER_IS_NOT_COMPLETED)],
        null,
      );
    }
    if (order.isReviewed) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.ORDER_IS_ALREADY_REVIEWED)],
        null,
      );
    }
    const review = await this.provider.createMyReview(
      payload.accountId,
      order.businessId,
      order.orderId,
      request.stars,
      request.comment,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersReviewResponse.fromEntity(new ReviewEntity(review)),
    );
  }
}
