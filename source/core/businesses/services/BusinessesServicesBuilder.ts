import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesServicesController } from "./BusinessesServicesController";

export class BusinessesServicesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId/services";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new BusinessesServicesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesServicesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getBusinessesServices.bind(this.controller),
    );
  }
}
