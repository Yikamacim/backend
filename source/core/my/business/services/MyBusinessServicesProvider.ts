import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import type { ServiceCategory } from "../../../../common/enums/ServiceCategory";
import { ServiceModel } from "../../../../common/models/ServiceModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { ServiceProvider } from "../../../../common/providers/ServiceProvider";
import { ServiceQueries } from "../../../../common/queries/ServiceQueries";

export class MyBusinessServicesProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    public readonly mediaProvider = new MediaProvider(),
    public readonly serviceProvider = new ServiceProvider(),
  ) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getActiveServices = this.serviceProvider.getActiveServices.bind(this.serviceProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getActiveServices: typeof this.serviceProvider.getActiveServices;

  public async getService(
    businessId: number,
    serviceId: number,
  ): Promise<ProviderResponse<ServiceModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ServiceQueries.GET_SERVICE_$BSID_$SVID, [
        businessId,
        serviceId,
      ]);
      const record: unknown = results.rows[0];
      if (!record) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(ServiceModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createService(
    businessId: number,
    title: string,
    mediaId: number | null,
    serviceCategory: ServiceCategory,
    description: string,
    unitPrice: number,
  ): Promise<ProviderResponse<ServiceModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        ServiceQueries.INSERT_SERVICE_$BSID_$TITLE_$MDID_$SCAT_$DESC_$UPRICE,
        [businessId, title, mediaId, serviceCategory, description, unitPrice],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(ServiceModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateService(
    serviceId: number,
    title: string,
    mediaId: number | null,
    serviceCategory: ServiceCategory,
    description: string,
    unitPrice: number,
  ): Promise<ProviderResponse<ServiceModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        ServiceQueries.UPDATE_SERVICE_$SVID_$TITLE_$MDID_$SCAT_$DESC_$UPRICE,
        [serviceId, title, mediaId, serviceCategory, description, unitPrice],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(ServiceModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async archiveService(serviceId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(ServiceQueries.UPDATE_SERVICE_$SVID_$ISDEL, [serviceId, true]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
