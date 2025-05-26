import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { HoursEntity } from "../../../../../common/entities/HoursEntity";

export class MyBusinessHoursResponse implements IResponse {
  private constructor(
    public readonly mondayFrom: string | null,
    public readonly mondayTo: string | null,
    public readonly tuesdayFrom: string | null,
    public readonly tuesdayTo: string | null,
    public readonly wednesdayFrom: string | null,
    public readonly wednesdayTo: string | null,
    public readonly thursdayFrom: string | null,
    public readonly thursdayTo: string | null,
    public readonly fridayFrom: string | null,
    public readonly fridayTo: string | null,
    public readonly saturdayFrom: string | null,
    public readonly saturdayTo: string | null,
    public readonly sundayFrom: string | null,
    public readonly sundayTo: string | null,
  ) {}

  public static fromEntity(entity: HoursEntity): MyBusinessHoursResponse {
    return new MyBusinessHoursResponse(
      entity.model.mondayFrom,
      entity.model.mondayTo,
      entity.model.tuesdayFrom,
      entity.model.tuesdayTo,
      entity.model.wednesdayFrom,
      entity.model.wednesdayTo,
      entity.model.thursdayFrom,
      entity.model.thursdayTo,
      entity.model.fridayFrom,
      entity.model.fridayTo,
      entity.model.saturdayFrom,
      entity.model.saturdayTo,
      entity.model.sundayFrom,
      entity.model.sundayTo,
    );
  }

  public static fromEntities(entities: HoursEntity[]): MyBusinessHoursResponse[] {
    return entities.map((entity) => MyBusinessHoursResponse.fromEntity(entity));
  }
}
