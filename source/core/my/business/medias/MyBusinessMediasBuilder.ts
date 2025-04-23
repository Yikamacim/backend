import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessMediasController } from "./MyBusinessMediasController";

export class MyBusinessMediasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/medias";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessMediasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessMediasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessMedias.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessMediasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessMedias.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessMediasBuilder.BASE_ROUTE, route: "/:mediaId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessMedias$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessMediasBuilder.BASE_ROUTE, route: "/:mediaId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessMedias$.bind(this.controller),
    );
  }
}
