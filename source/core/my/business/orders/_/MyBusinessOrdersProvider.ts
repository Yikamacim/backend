import type { ProviderResponse } from "../../../../../@types/responses";
import { DbConstants } from "../../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { OrderViewModel } from "../../../../../common/models/OrderViewModel";
import { BusinessProvider } from "../../../../../common/providers/BusinessProvider";
import { OrderProvider } from "../../../../../common/providers/OrderProvider";
import { OrderViewQueries } from "../../../../../common/queries/OrderViewQueries";

export class MyBusinessOrdersProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly businessProvider = new BusinessProvider(),
  ) {
    this.getBusinessOrder = this.orderProvider.getBusinessOrder.bind(this.orderProvider);
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
  }

  public readonly getBusinessOrder: typeof this.orderProvider.getBusinessOrder;
  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;

  public async getBusinessOrders(businessId: number): Promise<ProviderResponse<OrderViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDERS_$BSID, [businessId]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
