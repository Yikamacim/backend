import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessMediaProvider } from "../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { HoursProvider } from "../../../common/providers/HoursProvider";
import { ServiceProvider } from "../../../common/providers/ServiceProvider";

export class BusinessesProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
    private readonly serviceProvider = new ServiceProvider(),
    private readonly hoursProvider = new HoursProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getBusinessMedia = this.businessMediaProvider.getBusinessMedia.bind(
      this.businessMediaProvider,
    );
    this.getActiveServices = this.serviceProvider.getActiveServices.bind(this.serviceProvider);
    this.getHours = this.hoursProvider.getHours.bind(this.hoursProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getBusinessMedia: typeof this.businessMediaProvider.getBusinessMedia;
  public readonly getActiveServices: typeof this.serviceProvider.getActiveServices;
  public readonly getHours: typeof this.hoursProvider.getHours;
}
