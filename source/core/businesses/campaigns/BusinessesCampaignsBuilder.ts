import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesCampaignsController } from "./BusinessesCampaignsController";

export class BusinessesCampaignsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId/campaigns";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new BusinessesCampaignsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesCampaignsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getBusinessesCampaigns.bind(this.controller),
    );
  }
}
