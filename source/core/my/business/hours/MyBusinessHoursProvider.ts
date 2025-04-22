import type { ProviderResponse } from "../../../../@types/responses";
import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IProvider } from "../../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { HoursModel } from "../../../../common/models/HoursModel";
import { BusinessProvider } from "../../../../common/providers/BusinessProvider";
import { HoursQueries } from "../../../../common/queries/HoursQueries";

export class MyBusinessHoursProvider implements IProvider {
  public constructor(private readonly businessProvider = new BusinessProvider()) {
    this.getMyBusiness = this.businessProvider.getMyBusiness.bind(this.businessProvider);
  }

  public readonly getMyBusiness: typeof this.businessProvider.getMyBusiness;

  public async getMyBusinessHours(
    businessId: number,
  ): Promise<ProviderResponse<HoursModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(HoursQueries.GET_HOURS_$BSID, [businessId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(HoursModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBusinessHours(
    businessId: number,
    mondayFrom: string | null,
    mondayTo: string | null,
    tuesdayFrom: string | null,
    tuesdayTo: string | null,
    wednesdayFrom: string | null,
    wednesdayTo: string | null,
    thursdayFrom: string | null,
    thursdayTo: string | null,
    fridayFrom: string | null,
    fridayTo: string | null,
    saturdayFrom: string | null,
    saturdayTo: string | null,
    sundayFrom: string | null,
    sundayTo: string | null,
  ): Promise<ProviderResponse<HoursModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        HoursQueries.INSERT_HOURS_$BSID_$MONF_$MONT_$TUEF_$TUET_$WEDF_$WEDT_$THUF_$THUT_$FRIF_$FRIT_$SATF_$SATT_$SUNF_$SUNT,
        [
          businessId,
          mondayFrom,
          mondayTo,
          tuesdayFrom,
          tuesdayTo,
          wednesdayFrom,
          wednesdayTo,
          thursdayFrom,
          thursdayTo,
          fridayFrom,
          fridayTo,
          saturdayFrom,
          saturdayTo,
          sundayFrom,
          sundayTo,
        ],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(HoursModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateBusinessHours(
    businessId: number,
    mondayFrom: string | null,
    mondayTo: string | null,
    tuesdayFrom: string | null,
    tuesdayTo: string | null,
    wednesdayFrom: string | null,
    wednesdayTo: string | null,
    thursdayFrom: string | null,
    thursdayTo: string | null,
    fridayFrom: string | null,
    fridayTo: string | null,
    saturdayFrom: string | null,
    saturdayTo: string | null,
    sundayFrom: string | null,
    sundayTo: string | null,
  ): Promise<ProviderResponse<HoursModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        HoursQueries.UPDATE_HOURS_$BSID_$MONF_$MONT_$TUEF_$TUET_$WEDF_$WEDT_$THUF_$THUT_$FRIF_$FRIT_$SATF_$SATT_$SUNF_$SUNT,
        [
          businessId,
          mondayFrom,
          mondayTo,
          tuesdayFrom,
          tuesdayTo,
          wednesdayFrom,
          wednesdayTo,
          thursdayFrom,
          thursdayTo,
          fridayFrom,
          fridayTo,
          saturdayFrom,
          saturdayTo,
          sundayFrom,
          sundayTo,
        ],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(HoursModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
