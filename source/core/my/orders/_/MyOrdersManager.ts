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
import { MyOrdersProvider } from "./MyOrdersProvider";
import type { MyOrdersResponse } from "./schemas/MyOrdersResponse";

export class MyOrdersManager implements IManager {
  public constructor(private readonly provider = new MyOrdersProvider()) {}

  public async getMyOrders(payload: TokenPayload): Promise<ManagerResponse<MyOrdersResponse[]>> {
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
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
            null,
          );
        }
        serviceMediaEntity = await MediaHelper.mediaToEntity(serviceMedia);
      }
      let businessMediaEntity: MediaEntity | null = null;
      if (business.mediaId !== null) {
        const media = await this.provider.getBusinessMedia(business.businessId, business.mediaId);
        if (media === null) {
          return ResponseUtil.managerResponse(
            new HttpStatus(HttpStatusCode.NOT_FOUND),
            null,
            [new ClientError(ClientErrorCode.MEDIA_NOT_FOUND)],
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
      const items = await this.provider.getOrderItems(order.orderId);
      entities.push(new OrderEntity(order, serviceMediaEntity, businessMediaEntity, hoursToday));
    }
  }
}
