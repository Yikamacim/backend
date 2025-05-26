import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { OrderItemModel } from "../models/OrderItemModel";
import { OrderItemQueries } from "../queries/OrderItemQueries";

export class OrderItemProvider implements IProvider {
  public async getOrderItems(orderId: number): Promise<ProviderResponse<OrderItemModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderItemQueries.GET_ORDER_ITEMS_$ORID, [
        orderId,
      ]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(OrderItemModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
