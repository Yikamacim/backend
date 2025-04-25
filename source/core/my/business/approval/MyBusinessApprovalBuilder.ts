import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessApprovalController } from "./MyBusinessApprovalController";

export class MyBusinessApprovalBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/approval";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessApprovalController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessApprovalBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessApproval.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessApprovalBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessApproval.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessApprovalBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessApproval.bind(this.controller),
    );
  }
}
