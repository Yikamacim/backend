import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesMediasController } from "./BusinessesMediasController";

export class BusinessesMediasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId/medias";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new BusinessesMediasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesMediasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getBusinessesMedias.bind(this.controller),
    );
  }
}
