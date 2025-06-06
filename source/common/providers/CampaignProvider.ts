import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { CampaignModel } from "../models/CampaignModel";
import { CampaignQueries } from "../queries/CampaignQueries";

export class CampaignProvider implements IProvider {
  public async getCampaigns(businessId: number): Promise<ProviderResponse<CampaignModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CampaignQueries.GET_CAMPAIGNS_$BSID, [
        businessId,
      ]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CampaignModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
