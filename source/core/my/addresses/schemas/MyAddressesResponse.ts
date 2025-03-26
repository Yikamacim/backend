import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { AddressViewModel } from "../../../../common/models/AddressViewModel";

export class MyAddressesResponse implements IResponse {
  private constructor(
    public readonly addressId: number,
    public readonly name: string,
    public readonly countryId: number,
    public readonly countryName: string,
    public readonly provinceId: number,
    public readonly provinceName: string,
    public readonly districtId: number,
    public readonly districtName: string,
    public readonly neighborhoodId: number,
    public readonly neighborhoodName: string,
    public readonly expicitAddress: string,
    public readonly isDefault: boolean,
  ) {}

  public static fromModel(model: AddressViewModel): MyAddressesResponse {
    return new MyAddressesResponse(
      model.addressId,
      model.name,
      model.countryId,
      model.countryName,
      model.provinceId,
      model.provinceName,
      model.districtId,
      model.districtName,
      model.neighborhoodId,
      model.neighborhoodName,
      model.explicitAddress,
      model.isDefault,
    );
  }

  public static fromModels(models: AddressViewModel[]): MyAddressesResponse[] {
    return models.map((model: AddressViewModel) => MyAddressesResponse.fromModel(model));
  }
}
