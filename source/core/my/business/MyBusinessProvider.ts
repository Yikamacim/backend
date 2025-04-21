import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessModel } from "../../../common/models/BusinessModel";
import { BusinessViewModel } from "../../../common/models/BusinessViewModel";
import { BusinessQueries } from "../../../common/queries/BusinessQueries";
import { BusinessViewQueries } from "../../../common/queries/BusinessViewQueries";

export class MyBusinessProvider implements IProvider {
  public async getMyBusiness(
    accountId: number,
  ): Promise<ProviderResponse<BusinessViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyBusiness(accountId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createBusiness(
    accountId: number,
    name: string,
    mediaId: number | null,
    address: {
      readonly countryId: number;
      readonly provinceId: number;
      readonly districtId: number;
      readonly neighborhoodId: number;
      readonly explicitAddress: string;
    },
    phone: string,
    email: string,
    description: string,
  ): Promise<ProviderResponse<BusinessViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      return await ResponseUtil.providerResponse(await this.partialGetMyCarpet(accountId));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetMyBusiness(accountId: number): Promise<BusinessViewModel | null> {
    const results = await DbConstants.POOL.query(BusinessViewQueries.GET_BUSINESS_$ACID, [
      accountId,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return await ResponseUtil.providerResponse(null);
    }
    return await ResponseUtil.providerResponse(BusinessViewModel.fromRecord(record));
  }

  private async partialCreateBusiness(
    accountId: number,
    name: string,
    addressId: number,
    phone: string,
    email: string,
    description: string,
  ): Promise<BusinessModel> {
    const results = await DbConstants.POOL.query(
      BusinessQueries.INSERT_BUSINESS_RT_$ACID_$NAME_$ADID_$PHONE_$EMAIL_$DESC,
      [accountId, name, addressId, phone, email, description],
    );
    const record: unknown = results.rows[0];
    return BusinessModel.fromRecord(record);
  }

  // private async partialUpdateBusiness(
  //   carpetId: number,
  //   width: number | null,
  //   length: number | null,
  //   carpetMaterial: CarpetMaterial | null,
  // ): Promise<CarpetModel> {
  //   const results = await DbConstants.POOL.query(
  //     CarpetQueries.UPDATE_CARPET_RT_$CPID_$WIDTH_$LENGTH_$CMAT,
  //     [carpetId, width, length, carpetMaterial],
  //   );
  //   const record: unknown = results.rows[0];
  //   return CarpetModel.fromRecord(record);
  // }

  // private async partialDeleteCarpet(carpetId: number): Promise<void> {
  //   await DbConstants.POOL.query(CarpetQueries.DELETE_CARPET_$CPID, [carpetId]);
  // }
}
