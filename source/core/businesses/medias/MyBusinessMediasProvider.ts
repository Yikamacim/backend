import type { IProvider } from "../../../app/interfaces/IProvider";
import { BusinessMediaProvider } from "../../../common/providers/BusinessMediaProvider";
import { BusinessProvider } from "../../../common/providers/BusinessProvider";

export class BusinessesMediasProvider implements IProvider {
  public constructor(
    private readonly businessProvider = new BusinessProvider(),
    private readonly businessMediaProvider = new BusinessMediaProvider(),
  ) {
    this.getBusiness = this.businessProvider.getBusinessByAccountId.bind(this.businessProvider);
    this.getBusinessMedias = this.businessMediaProvider.getBusinessMedias.bind(
      this.businessMediaProvider,
    );
  }

  public readonly getBusiness: typeof this.businessProvider.getBusiness;
  public readonly getBusinessMedias: typeof this.businessMediaProvider.getBusinessMedias;
}
