import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyCardsController } from "./MyCardsController";

export class MyCardsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/cards";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyCardsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCardsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCards.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCardsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyCards.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCardsBuilder.BASE_ROUTE, route: "/:cardId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCards$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCardsBuilder.BASE_ROUTE, route: "/:cardId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyCards$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCardsBuilder.BASE_ROUTE, route: "/:cardId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyCards$.bind(this.controller),
    );
  }
}
