import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { SearchController } from "./SearchController";

export class SearchBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/search";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new SearchController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: SearchBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getSearch.bind(this.controller),
    );
  }
}
