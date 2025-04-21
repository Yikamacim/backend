import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { BusinessMediaQueries } from "../queries/BusinessMediaQueries";

export class BusinessMediaProvider implements IProvider {
  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

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

  public async partialDeleteBusinessMainMedia(businessId: number): Promise<void> {
    await DbConstants.POOL.query(BusinessMediaQueries.DELETE_BUSINESS_MEDIA_$BSID_$ISMN, [
      businessId,
      true,
    ]);
  }
}
