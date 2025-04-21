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
  public async createAddress(
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
        await this.partialGetAddress(AddressModel.fromRecord(record).addressId),
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
        await this.partialGetAddress(AddressModel.fromRecord(record).addressId),
      );
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async deleteAddress(addressId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(AddressQueries.DELETE_ADDRESS_$ADID, [addressId]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetAddress(addressId: number): Promise<AddressViewModel> {
    const results = await DbConstants.POOL.query(AddressViewQueries.GET_ADDRESS_$ADID, [addressId]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      throw new UnexpectedDatabaseStateError("Address was not created");
    }
    return AddressViewModel.fromRecord(record);
  }
}
