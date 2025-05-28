import type { ManagerResponse } from "../../../../../@types/responses";
import type { TokenPayload } from "../../../../../@types/tokens";
import type { IManager } from "../../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { EOrderState } from "../../../../../common/enums/EOrderState";
import { OrderHelper } from "../../../../../common/helpers/OrderHelper";
import { MyBusinessOrdersOfferProvider } from "./MyBusinessOrdersOfferProvider";
import type { MyBusinessOrdersOfferParams } from "./schemas/MyBusinessOrdersOfferParams";
import type { MyBusinessOrdersOfferRequest } from "./schemas/MyBusinessOrdersOfferRequest";
import { MyBusinessOrdersOfferResponse } from "./schemas/MyBusinessOrdersOfferResponse";

export class MyBusinessOrdersOfferManager implements IManager {
  public constructor(private readonly provider = new MyBusinessOrdersOfferProvider()) {}

  public async postMyBusinessOrdersOffer(
    payload: TokenPayload,
    params: MyBusinessOrdersOfferParams,
    request: MyBusinessOrdersOfferRequest,
  ): Promise<ManagerResponse<MyBusinessOrdersOfferResponse | null>> {
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
    if (order.orderState !== EOrderState.PENDING) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.OFFER_CANNOT_BE_MADE)],
        null,
      );
    }
    const updatedOrder = await this.provider.makeOffer(order.orderId, request.price);
    const entityResult = await OrderHelper.orderToEntity(updatedOrder);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyBusinessOrdersOfferResponse.fromEntity(entity),
    );
  }

  public async deleteMyBusinessOrdersOffer(
    payload: TokenPayload,
    params: MyBusinessOrdersOfferParams,
  ): Promise<ManagerResponse<MyBusinessOrdersOfferResponse | null>> {
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
    if (order.orderState !== EOrderState.OFFERED) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.BAD_REQUEST),
        null,
        [new ClientError(ClientErrorCode.OFFER_CANNOT_BE_WITHDRAWN)],
        null,
      );
    }
    const updatedOrder = await this.provider.withdrawOffer(order.orderId);
    const entityResult = await OrderHelper.orderToEntity(updatedOrder);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOrdersOfferResponse.fromEntity(entity),
    );
  }
}
