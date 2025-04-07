import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ItemModel } from "../models/ItemModel";
import { ItemQueries } from "../queries/ItemQueries";

export class ItemProvider implements IProvider {
  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialCreateItem(
    accountId: number,
    name: string,
    description: string,
  ): Promise<ItemModel> {
    const results = await DbConstants.POOL.query(ItemQueries.INSERT_ITEM_RT_$ACID_$NAME_$DESC, [
      accountId,
      name,
      description,
    ]);
    const record: unknown = results.rows[0];
    return ItemModel.fromRecord(record);
  }

  public async partialUpdateItem(itemId: number, name: string, description: string): Promise<void> {
    await DbConstants.POOL.query(ItemQueries.UPDATE_ITEM_$ITID_$NAME_$DESC, [
      itemId,
      name,
      description,
    ]);
  }

  public async partialDeleteItem(itemId: number): Promise<void> {
    await DbConstants.POOL.query(ItemQueries.DELETE_ITEM_$ITID, [itemId]);
  }
}
