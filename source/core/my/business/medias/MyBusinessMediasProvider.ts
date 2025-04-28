import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../../app/schemas/ServerError";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { BusinessMediaViewModel } from "../../../../common/models/BusinessMediaViewModel";
import { BusinessMediaProvider } from "../../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { BusinessMediaViewQueries } from "../../../../common/queries/BusinessMediaViewQueries";

export class MyBusinessMediasProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialGetBusinessMedia = this.businessMediaProvider.partialGetBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialCreateBusinessMedia = this.businessMediaProvider.partialCreateBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.partialDeleteBusinessMedia = this.businessMediaProvider.partialDeleteBusinessMedia.bind(
      this.businessMediaProvider,
    );
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;

  private readonly partialGetBusinessMedia: typeof this.businessMediaProvider.partialGetBusinessMedia;
  private readonly partialCreateBusinessMedia: typeof this.businessMediaProvider.partialCreateBusinessMedia;
  private readonly partialDeleteBusinessMedia: typeof this.businessMediaProvider.partialDeleteBusinessMedia;

  public async getBusinessMedias(
    businessId: number,
  ): Promise<ProviderResponse<BusinessMediaViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        BusinessMediaViewQueries.GET_BUSINESS_MEDIAS_$BSID_$ISMN,
        [businessId, false],
      );
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(BusinessMediaViewModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBusinessMedia(
    businessId: number,
    mediaId: number,
  ): Promise<ProviderResponse<BusinessMediaViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialCreateBusinessMedia(businessId, mediaId, false);
      const media = await this.partialGetBusinessMedia(businessId, mediaId);
      if (media === null) {
        throw new UnexpectedDatabaseStateError("Business media was not created");
      }
      return await ResponseUtil.providerResponse(media);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteBusinessMedia(
    businessId: number,
    mediaId: number,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteBusinessMedia(businessId, mediaId);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
