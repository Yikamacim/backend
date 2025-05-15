import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesAboutController } from "./BusinessesAboutController";

export class BusinessesAboutBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId/about";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new BusinessesAboutController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesAboutBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getBusinessesAbout.bind(this.controller),
    );
  }
}
