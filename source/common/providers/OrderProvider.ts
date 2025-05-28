import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { EOrderState } from "../enums/EOrderState";
import { OrderModel } from "../models/OrderModel";
import { OrderViewModel } from "../models/OrderViewModel";
import { OrderQueries } from "../queries/OrderQueries";
import { OrderViewQueries } from "../queries/OrderViewQueries";

export class OrderProvider implements IProvider {
  public async getMyOrder(
    accountId: number,
    orderId: number,
  ): Promise<ProviderResponse<OrderViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDER_$ACID_$ORID, [
        accountId,
        orderId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getBusinessOrder(
    businessId: number,
    orderId: number,
  ): Promise<ProviderResponse<OrderViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDER_$BSID_$ORID, [
        businessId,
        orderId,
      ]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async cancelOrder(orderId: number): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const order = await this.partialUpdateOrderState(orderId, EOrderState.CANCELLED);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new Error("Order was not cancelled");
      }
      return await ResponseUtil.providerResponse(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialGetOrder(orderId: number): Promise<OrderViewModel | null> {
    const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDER_$ORID, [orderId]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return OrderViewModel.fromRecord(record);
  }

  public async partialUpdateOrder(
    orderId: number,
    orderState: EOrderState,
    price: number | null,
  ): Promise<OrderModel> {
    const results = await DbConstants.POOL.query(OrderQueries.UPDATE_ORDER_RT_$ORID_$STATE_$PRICE, [
      orderId,
      orderState,
      price,
    ]);
    const record: unknown = results.rows[0];
    return OrderModel.fromRecord(record);
  }

  public async partialUpdateOrderState(
    orderId: number,
    orderState: EOrderState,
  ): Promise<OrderModel> {
    const results = await DbConstants.POOL.query(OrderQueries.UPDATE_ORDER_RT_$ORID_$STATE, [
      orderId,
      orderState,
    ]);
    const record: unknown = results.rows[0];
    return OrderModel.fromRecord(record);
  }
}
