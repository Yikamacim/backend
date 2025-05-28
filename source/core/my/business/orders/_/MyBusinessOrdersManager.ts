import type { ManagerResponse } from "../../../../../@types/responses";
import type { TokenPayload } from "../../../../../@types/tokens";
import type { IManager } from "../../../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { OrderHelper } from "../../../../../common/helpers/OrderHelper";
import { MyBusinessOrdersProvider } from "./MyBusinessOrdersProvider";
import type { MyBusinessOrdersParams } from "./schemas/MyBusinessOrdersParams";
import { MyBusinessOrdersResponse } from "./schemas/MyBusinessOrdersResponse";

export class MyBusinessOrdersManager implements IManager {
  public constructor(private readonly provider = new MyBusinessOrdersProvider()) {}

  public async getMyBusinessOrders(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MyBusinessOrdersResponse[] | null>> {
    const business = await this.provider.getMyBusiness(payload.accountId);
    if (business === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS)],
        null,
      );
    }
    const orders = await this.provider.getBusinessOrders(business.businessId);
    const entitiesResult = await OrderHelper.ordersToEntities(orders);
    if (entitiesResult.isLeft()) {
      return entitiesResult.get();
    }
    const entities = entitiesResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOrdersResponse.fromEntities(entities),
    );
  }

  public async getMyBusinessOrders$(
    payload: TokenPayload,
    params: MyBusinessOrdersParams,
  ): Promise<ManagerResponse<MyBusinessOrdersResponse | null>> {
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
    const entityResult = await OrderHelper.orderToEntity(order);
    if (entityResult.isLeft()) {
      return entityResult.get();
    }
    const entity = entityResult.get();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MyBusinessOrdersResponse.fromEntity(entity),
    );
  }
}
