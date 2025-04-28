import type { IResponse } from "../../../../../app/interfaces/IResponse";
import type { HoursModel } from "../../../../../common/models/HoursModel";

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

  public static fromModel(model: HoursModel): MyBusinessHoursResponse {
    return new MyBusinessHoursResponse(
      model.mondayFrom,
      model.mondayTo,
      model.tuesdayFrom,
      model.tuesdayTo,
      model.wednesdayFrom,
      model.wednesdayTo,
      model.thursdayFrom,
      model.thursdayTo,
      model.fridayFrom,
      model.fridayTo,
      model.saturdayFrom,
      model.saturdayTo,
      model.sundayFrom,
      model.sundayTo,
    );
  }
}
