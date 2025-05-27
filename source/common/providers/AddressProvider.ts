import type { ProviderResponse } from "../../@types/responses";
import { DbConstants } from "../../app/constants/DbConstants";
import type { IProvider } from "../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AddressModel } from "../models/AddressModel";
import { AddressViewModel } from "../models/AddressViewModel";
import { AddressQueries } from "../queries/AddressQueries";
import { AddressViewQueries } from "../queries/AddressViewQueries";

export class AddressProvider implements IProvider {
  public async getMyActiveAddress(
    accountId: number,
    addressId: number,
  ): Promise<ProviderResponse<AddressViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        AddressViewQueries.GET_ADDRESS_$ACID_$ADID_$ISDEL,
        [accountId, addressId, false],
      );
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(AddressViewModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMyAddress(
    accountId: number,
    name: string,
    countryId: number,
    provinceId: number,
    districtId: number,
    neighborhoodId: number,
    explicitAddress: string,
    isDefault: boolean,
  ): Promise<ProviderResponse<AddressViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        AddressQueries.INSERT_ADDRESS_RT_$ACID_$NAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF,
        [
          accountId,
          name,
          countryId,
          provinceId,
          districtId,
          neighborhoodId,
          explicitAddress,
          isDefault,
        ],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(
        await this.partialGetActiveAddress(AddressModel.fromRecord(record).addressId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateAddress(
    addressId: number,
    name: string,
    countryId: number,
    provinceId: number,
    districtId: number,
    neighborhoodId: number,
    explicitAddress: string,
    isDefault: boolean,
  ): Promise<ProviderResponse<AddressViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        AddressQueries.UPDATE_ADDRESS_RT_$ADID_$NAME_$CNID_$PVID_$DSID_$NBID_$EXAD_$ISDF,
        [
          addressId,
          name,
          countryId,
          provinceId,
          districtId,
          neighborhoodId,
          explicitAddress,
          isDefault,
        ],
      );
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(
        await this.partialGetActiveAddress(AddressModel.fromRecord(record).addressId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveAddress(addressId: number): Promise<AddressViewModel> {
    const results = await DbConstants.POOL.query(AddressViewQueries.GET_ADDRESS_$ADID_$ISDEL, [
      addressId,
      false,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      throw new UnexpectedDatabaseStateError("Address was not created");
    }
    return AddressViewModel.fromRecord(record);
  }
}
