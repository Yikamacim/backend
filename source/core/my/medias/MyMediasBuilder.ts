import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyMediasController } from "./MyMediasController";

export class MyMediasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/medias";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyMediasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyMediasBuilder.BASE_ROUTE, route: "/upload/:mediaType" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyMediasUpload$mediaType.bind(this.controller),
    );
  }
}
