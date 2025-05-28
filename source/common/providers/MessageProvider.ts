import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { MessageModel } from "../models/MessageModel";
import { MessageQueries } from "../queries/MessageQueries";
import { OrderQueries } from "../queries/OrderQueries";

export class MessageProvider implements IProvider {
  public async getMessages(orderId: number): Promise<ProviderResponse<MessageModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MessageQueries.GET_MESSAGES_$ORID, [orderId]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(MessageModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMessage(
    orderId: number,
    fromBusiness: boolean,
    content: string,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(MessageQueries.INSERT_MESSAGE_$ORID_$FRBS_$CONT, [
        orderId,
        fromBusiness,
        content,
      ]);
      await DbConstants.POOL.query(OrderQueries.UPDATE_ORDER_$ORID, [orderId]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
