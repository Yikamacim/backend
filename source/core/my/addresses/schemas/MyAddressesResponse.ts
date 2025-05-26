import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { AddressEntity } from "../../../../common/entities/AddressEntity";

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

  public static fromEntity(entity: AddressEntity): MyAddressesResponse {
    return new MyAddressesResponse(
      entity.model.addressId,
      entity.model.name,
      entity.model.countryId,
      entity.model.countryName,
      entity.model.provinceId,
      entity.model.provinceName,
      entity.model.districtId,
      entity.model.districtName,
      entity.model.neighborhoodId,
      entity.model.neighborhoodName,
      entity.model.explicitAddress,
      entity.model.isDefault,
    );
  }

  public static fromEntities(entities: AddressEntity[]): MyAddressesResponse[] {
    return entities.map((entity) => MyAddressesResponse.fromEntity(entity));
  }
}
