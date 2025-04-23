import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { BusinessMediaViewModel } from "../models/BusinessMediaViewModel";
import { BusinessMediaQueries } from "../queries/BusinessMediaQueries";
import { BusinessMediaViewQueries } from "../queries/BusinessMediaViewQueries";

export class BusinessMediaProvider implements IProvider {
  public async getBusinessMedia(
    businessId: number,
    mediaId: number,
  ): Promise<ProviderResponse<BusinessMediaViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(
        await this.partialGetBusinessMedia(businessId, mediaId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  public async partialGetBusinessMedia(
    businessId: number,
    mediaId: number,
  ): Promise<BusinessMediaViewModel | null> {
    const results = await DbConstants.POOL.query(
      BusinessMediaViewQueries.GET_BUSINESS_MEDIA_$BSID_$MDID,
      [businessId, mediaId],
    );
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return await ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(BusinessMediaViewModel.fromRecord(record));
  }

  public async partialCreateBusinessMedia(
    businessId: number,
    mediaId: number,
    isMain: boolean,
  ): Promise<void> {
    await DbConstants.POOL.query(BusinessMediaQueries.INSERT_BUSINESS_MEDIA_$BSID_$MDID_$ISMN, [
      businessId,
      mediaId,
      isMain,
    ]);
  }

  public async partialDeleteBusinessMedia(businessId: number, mediaId: number): Promise<void> {
    await DbConstants.POOL.query(BusinessMediaQueries.DELETE_BUSINESS_MEDIA_$BSID_$MDID_$ISMN, [
      businessId,
      mediaId,
      false,
    ]);
  }

  public async partialDeleteBusinessMainMedia(businessId: number): Promise<void> {
    await DbConstants.POOL.query(BusinessMediaQueries.DELETE_BUSINESS_MEDIA_$BSID_$ISMN, [
      businessId,
      true,
    ]);
  }
}
