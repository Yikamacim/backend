import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ItemModel } from "../models/ItemModel";
import { ItemQueries } from "../queries/ItemQueries";
import { ItemMediaProvider } from "./ItemMediaProvider";

export class ItemProvider implements IProvider {
  public constructor(private readonly itemMediaProvider = new ItemMediaProvider()) {
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
  }

  private readonly partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;

  public async archiveItem(itemId: number, mediaIds: number[]): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, mediaIds);
      await this.partialArchiveItem(itemId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialCreateMyItem(
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

  private async partialArchiveItem(itemId: number): Promise<void> {
    await DbConstants.POOL.query(ItemQueries.UPDATE_ITEM_$ITID_$ISDEL, [itemId, true]);
  }
}
