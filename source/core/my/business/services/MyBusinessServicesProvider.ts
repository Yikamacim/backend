import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import type { ServiceCategory } from "../../../../common/enums/ServiceCategory";
import { ServiceModel } from "../../../../common/models/ServiceModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { MediaProvider } from "../../../../common/providers/MediaProvider";
import { ServiceQueries } from "../../../../common/queries/ServiceQueries";

export class MyBusinessServicesProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    public readonly mediaProvider = new MediaProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;

  public async getServices(businessId: number): Promise<ProviderResponse<ServiceModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(ServiceQueries.GET_SERVICES_$BSID, [businessId]);
      const record: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(ServiceModel.fromRecords(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

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
    businessId: number,
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
        ServiceQueries.UPDATE_SERVICE_$BSID_$SVID_$TITLE_$MDID_$SCAT_$DESC_$UPRICE,
        [businessId, serviceId, title, mediaId, serviceCategory, description, unitPrice],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(ServiceModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteService(
    businessId: number,
    serviceId: number,
  ): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(ServiceQueries.DELETE_SERVICE_$BSID_$SVID, [
        businessId,
        serviceId,
      ]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
