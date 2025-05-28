import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { EOrderState } from "../../../../common/enums/EOrderState";
import { OrderViewModel } from "../../../../common/models/OrderViewModel";
import { CardProvider } from "../../../../common/providers/CardProvider";
import { OrderProvider } from "../../../../common/providers/OrderProvider";
import { BankAccountQueries } from "../../../../common/queries/BankAccountQueries";

export class MyOrdersCompleteProvider implements IProvider {
  public constructor(
    private readonly orderProvider = new OrderProvider(),
    private readonly cardProvider = new CardProvider(),
  ) {
    this.getMyOrder = this.orderProvider.getMyOrder.bind(this.orderProvider);
    this.partialGetOrder = this.orderProvider.partialGetOrder.bind(this.orderProvider);
    this.partialUpdateOrderState = this.orderProvider.partialUpdateOrderState.bind(
      this.orderProvider,
    );
    this.getMyActiveCard = this.cardProvider.getMyActiveCard.bind(this.cardProvider);
  }

  public readonly getMyOrder: typeof this.orderProvider.getMyOrder;
  public readonly partialGetOrder: typeof this.orderProvider.partialGetOrder;
  public readonly partialUpdateOrderState: typeof this.orderProvider.partialUpdateOrderState;
  public readonly getMyActiveCard: typeof this.cardProvider.getMyActiveCard;

  public async completeOrder(
    orderId: number,
    businessId: number,
    price: number,
  ): Promise<ProviderResponse<OrderViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialUpdateBankAccountBalance(businessId, price);
      const order = await this.partialUpdateOrderState(orderId, EOrderState.COMPLETED);
      const orderView = await this.partialGetOrder(order.orderId);
      if (orderView === null) {
        throw new Error("Order not found after completion");
      }
      // 3. get the order view
      return OrderViewModel.fromRecord(orderView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialUpdateBankAccountBalance(businessId: number, price: number): Promise<void> {
    await DbConstants.POOL.query(BankAccountQueries.UPDATE_BANK_ACCOUNT_$BSID_$BLCH, [
      businessId,
      price,
    ]);
  }
}
