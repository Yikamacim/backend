import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { OrderItemModel } from "../../../../common/models/OrderItemModel";
import { OrderViewModel } from "../../../../common/models/OrderViewModel";
import { HoursProvider } from "../../../../common/providers/HoursProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { OrderItemQueries } from "../../../../common/queries/OrderItemQueries";
import { OrderViewQueries } from "../../../../common/queries/OrderViewQueries";

export class MyOrdersProvider implements IProvider {
  public constructor(
    private readonly mediaProvider = new MediaProvider(),
    private readonly hoursProvider = new HoursProvider(),
  ) {
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
  }

  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getHours: typeof this.hoursProvider.getHours;

  public async getMyOrders(accountId: number): Promise<ProviderResponse<OrderViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(OrderViewQueries.GET_ORDERS_$ACID, [accountId]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(OrderViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }


}
