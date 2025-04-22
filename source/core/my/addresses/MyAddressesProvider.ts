import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AddressViewModel } from "../../../common/models/AddressViewModel";
import { AddressProvider } from "../../../common/providers/AddressProvider";
import { AddressQueries } from "../../../common/queries/AddressQueries";
import { AddressViewQueries } from "../../../common/queries/AddressViewQueries";

export class MyAddressesProvider implements IProvider {
  public constructor(private readonly addressProvider = new AddressProvider()) {
    this.createAddress = this.addressProvider.createAddress.bind(this.addressProvider);
    this.updateAddress = this.addressProvider.updateAddress.bind(this.addressProvider);
    this.deleteAddress = this.addressProvider.deleteAddress.bind(this.addressProvider);
  }

  public readonly createAddress: typeof this.addressProvider.createAddress;
  public readonly updateAddress: typeof this.addressProvider.updateAddress;
  public readonly deleteAddress: typeof this.addressProvider.deleteAddress;

  public async getMyAddresses(accountId: number): Promise<ProviderResponse<AddressViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AddressViewQueries.GET_ADDRESSES_$ACID, [
        accountId,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(AddressViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyAddress(
    accountId: number,
    addressId: number,
  ): Promise<ProviderResponse<AddressViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AddressViewQueries.GET_ADDRESS_$ACID_$ADID, [
        accountId,
        addressId,
      ]);
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

  public async clearMyDefaultAddresses(accountId: number): Promise<ProviderResponse<null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await DbConstants.POOL.query(AddressQueries.UPDATE_ADDRESSES_$ACID_$ISDF, [accountId, false]);
      return await ResponseUtil.providerResponse(null);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
