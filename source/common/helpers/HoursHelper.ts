import type { IHelper } from "../../app/interfaces/IHelper";
import { UnexpectedWeekdayError } from "../../app/schemas/ServerError";
import { DateUtil } from "../../app/utils/DateUtil";
import type { HoursModel } from "../models/HoursModel";

export class HoursHelper implements IHelper {
  public static getTodayHours(hours: HoursModel): {
    readonly from: string | null;
    readonly to: string | null;
  } {
    const weekday = DateUtil.getWeekday(new Date());
    switch (weekday) {
      case "Monday":
        return {
          from: hours.mondayFrom,
          to: hours.mondayTo,
        };
      case "Tuesday":
        return {
          from: hours.tuesdayFrom,
          to: hours.tuesdayTo,
        };
      case "Wednesday":
        return {
          from: hours.wednesdayFrom,
          to: hours.wednesdayTo,
        };
      case "Thursday":
        return {
          from: hours.thursdayFrom,
          to: hours.thursdayTo,
        };
      case "Friday":
        return {
          from: hours.fridayFrom,
          to: hours.fridayTo,
        };
      case "Saturday":
        return {
          from: hours.saturdayFrom,
          to: hours.saturdayTo,
        };
      case "Sunday":
        return {
          from: hours.sundayFrom,
          to: hours.sundayTo,
        };
      default:
        throw new UnexpectedWeekdayError(weekday);
    }
  }
}
