import type { ManagerResponse } from "../../../../@types/responses";
import type { TokenPayload } from "../../../../@types/tokens";
import type { IManager } from "../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import type { MediaEntity } from "../../../../common/entities/MediaEntity";
import { OrderEntity } from "../../../../common/entities/OrderEntity";
import { HoursHelper } from "../../../../common/helpers/HoursHelper";
import { MediaHelper } from "../../../../common/helpers/MediaHelper";
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
    const entities: OrderEntity[] = [];
    for (const order of orders) {
      let serviceMediaEntity: MediaEntity | null = null;
      if (order.serviceMediaId !== null) {
        const serviceMedia = await this.provider.getMedia(order.serviceMediaId);
        if (serviceMedia === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
            null,
          );
        }
        serviceMediaEntity = await MediaHelper.mediaToEntity(serviceMedia);
      }
      let businessMediaEntity: MediaEntity | null = null;
      if (order.businessMediaId !== null) {
        const media = await this.provider.getBusinessMedia(order.businessId, order.businessMediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
            null,
          );
        }
        businessMediaEntity = await MediaHelper.mediaToEntity(media);
      }
      let hoursToday: {
        readonly from: string | null;
        readonly to: string | null;
      } | null = null;
      const hours = await this.provider.getHours(order.businessId);
      if (hours !== null) {
        hoursToday = HoursHelper.getTodayHours(hours);
      }
      const itemsResult = await OrderHelper.getOrderItems(order.orderId, order.serviceCategory);
      if (itemsResult.isLeft()) {
        return itemsResult.get();
      }
      const items = itemsResult.get();
      entities.push(
        new OrderEntity(order, serviceMediaEntity, businessMediaEntity, hoursToday, items),
      );
    }
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
        [new ClientError(ClientErrorCode.HAS_NO_ADDRESS_WITH_ID)],
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
        [new ClientError(ClientErrorCode.BUSINESS_DOESNT_SERVE_AREA)],
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
    const order = await this.provider.createMyOrder();
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
        [new ClientError(ClientErrorCode.HAS_NO_ORDER_WITH_ID)],
        null,
      );
    }
    let serviceMediaEntity: MediaEntity | null = null;
    if (order.serviceMediaId !== null) {
      const serviceMedia = await this.provider.getMedia(order.serviceMediaId);
      if (serviceMedia === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
          null,
        );
      }
      serviceMediaEntity = await MediaHelper.mediaToEntity(serviceMedia);
    }
    let businessMediaEntity: MediaEntity | null = null;
    if (order.businessMediaId !== null) {
      const media = await this.provider.getBusinessMedia(order.businessId, order.businessMediaId);
      if (media === null) {
        return ResponseUtil.managerResponse(
          new HttpStatus(HttpStatusCode.NOT_FOUND),
          null,
          [new ClientError(ClientErrorCode.HAS_NO_MEDIA_WITH_ID)],
          null,
        );
      }
      businessMediaEntity = await MediaHelper.mediaToEntity(media);
    }
    let hoursToday: {
      readonly from: string | null;
      readonly to: string | null;
    } | null = null;
    const hours = await this.provider.getHours(order.businessId);
    if (hours !== null) {
      hoursToday = HoursHelper.getTodayHours(hours);
    }
    const itemsResult = await OrderHelper.getOrderItems(order.orderId, order.serviceCategory);
    if (itemsResult.isLeft()) {
      return itemsResult.get();
    }
    const items = itemsResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyOrdersResponse.fromEntity(
        new OrderEntity(order, serviceMediaEntity, businessMediaEntity, hoursToday, items),
      ),
    );
  }
}
