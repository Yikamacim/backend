import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessCampaignsController } from "./MyBusinessCampaignsController";

export class MyBusinessCampaignsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/campaigns";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessCampaignsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessCampaignsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessCampaigns.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessCampaignsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessCampaigns.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessCampaignsBuilder.BASE_ROUTE, route: "/:campaignId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessCampaigns$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessCampaignsBuilder.BASE_ROUTE, route: "/:campaignId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessCampaigns$.bind(this.controller),
    );
  }
}
