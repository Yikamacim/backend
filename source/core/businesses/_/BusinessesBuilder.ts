import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesController } from "./BusinessesController";

export class BusinessesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new BusinessesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getBusinesses$.bind(this.controller),
    );
  }
}
