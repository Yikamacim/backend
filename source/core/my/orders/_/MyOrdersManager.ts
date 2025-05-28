import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { OrderHelper } from "../../../../common/helpers/OrderHelper";
import { MyOrdersProvider } from "./MyOrdersProvider";
import type { MyOrdersParams } from "./schemas/MyOrdersParams";
import type { MyOrdersRequest } from "./schemas/MyOrdersRequest";
import { MyOrdersResponse } from "./schemas/MyOrdersResponse";

export class MyOrdersManager implements IManager {
  public constructor(private readonly provider = new MyOrdersProvider()) {}

  public async getMyOrders(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyOrdersResponse[] | null>> {
    const orders = await this.provider.getMyOrders(payload.accountId);
    const entitiesResult = await OrderHelper.ordersToEntities(orders);
    if (entitiesResult.isLeft()) {
      return entitiesResult.get();
    }
    const entities = entitiesResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersResponse.fromEntities(entities),
    );
  }

  public async postMyOrders(
    payload: TokenPayload,
    request: MyOrdersRequest,
  ): Promise<ManagerResponse<MyOrdersResponse | null>> {
    const service = await this.provider.getActiveService(request.serviceId);
    if (service === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SERVICE_NOT_FOUND)],
        null,
      );
    }
    const address = await this.provider.getMyActiveAddress(payload.accountId, request.addressId);
    if (address === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ADDRESS_WITH_THIS_ID)],
        null,
      );
    }
    const business = await this.provider.getBusiness(service.businessId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_NOT_FOUND)],
        null,
      );
    }
    const businessAreas = await this.provider.getBusinessAreas(business.businessId);
    if (!businessAreas.some((area) => area.neighborhoodId === address.neighborhoodId)) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_SERVE_THIS_AREA)],
        null,
      );
    }
    if (!business.isOpen) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.BUSINESS_IS_CLOSED)],
        null,
      );
    }
    const itemIdsResult = await OrderHelper.findMyOrderItems(
      payload.accountId,
      request.itemIds,
      service.serviceCategory,
    );
    if (itemIdsResult.isLeft()) {
      return itemIdsResult.get();
    }
    const itemIds = itemIdsResult.get();
    const order = await this.provider.createMyOrder(
      service.serviceId,
      address.addressId,
      payload.accountId,
      itemIds,
    );
    if (request.note !== null) {
      await this.provider.createMessage(order.orderId, false, request.note);
    }
    const entityResult = await OrderHelper.orderToEntity(order);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      MyOrdersResponse.fromEntity(entity),
    );
  }

  public async getMyOrders$(
    payload: TokenPayload,
    params: MyOrdersParams,
  ): Promise<ManagerResponse<MyOrdersResponse | null>> {
    const order = await this.provider.getMyOrder(payload.accountId, parseInt(params.orderId));
    if (order === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID)],
        null,
      );
    }
    const entityResult = await OrderHelper.orderToEntity(order);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersResponse.fromEntity(entity),
    );
  }
}
