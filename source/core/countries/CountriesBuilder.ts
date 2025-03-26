import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { CountriesController } from "./CountriesController";

export class CountriesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "countries";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new CountriesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: CountriesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getCountries.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: CountriesBuilder.BASE_ROUTE, route: "/:countryId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getCountries$countryId.bind(this.controller),
    );
  }
}
