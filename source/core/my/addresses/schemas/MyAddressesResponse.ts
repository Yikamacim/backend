import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { AddressModel } from "../../../../common/models/AddressModel";

export class MyAddressesResponse implements IResponse {
  private constructor(
    public readonly addressesId: number,
    public readonly name: string,
    public readonly countryId: number,
    public readonly provinceId: number,
    public readonly districtId: number,
    public readonly neighborhoodId: number,
    public readonly expicitAddress: string,
    public readonly isDefault: boolean,
  ) {}

  public static fromModel(model: AddressModel): MyAddressesResponse {
    return new MyAddressesResponse(
      model.addressId,
      model.name,
      model.countryId,
      model.provinceId,
      model.districtId,
      model.neighbourhoodId,
      model.explicitAddress,
      model.isDefault,
    );
  }

  public static fromModels(models: AddressModel[]): MyAddressesResponse[] {
    return models.map((model: AddressModel) => MyAddressesResponse.fromModel(model));
  }
}
