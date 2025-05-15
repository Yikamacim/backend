import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";
import { MediaProvider } from "../../../common/providers/MediaProvider";
import { ServiceProvider } from "../../../common/providers/ServiceProvider";

export class BusinessesServicesProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    public readonly mediaProvider = new MediaProvider(),
    public readonly serviceProvider = new ServiceProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusiness.bind(this.businessProvider);
    this.getMedia = this.mediaProvider.getMedia.bind(this.mediaProvider);
    this.getServices = this.serviceProvider.getServices.bind(this.serviceProvider);
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getMedia: typeof this.mediaProvider.getMedia;
  public readonly getServices: typeof this.serviceProvider.getServices;
}
