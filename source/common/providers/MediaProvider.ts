import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { MediaViewModel } from "../models/MediaViewModel";
import { MediaViewQueries } from "../queries/MediaViewQueries";

export class MediaProvider implements IProvider {
  public async getMyMedias(accountId: number): Promise<ProviderResponse<MediaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(MediaViewQueries.GET_MEDIAS_$ACID_$ISUS, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(MediaViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
