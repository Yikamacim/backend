import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { HoursProvider } from "../../../common/providers/HoursProvider";

export class BusinessesAboutProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly hoursProvider = new HoursProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getHours: typeof this.hoursProvider.getHours;
}
