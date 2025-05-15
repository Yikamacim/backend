import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { AdminApprovalsController } from "./AdminApprovalsController";

export class AdminApprovalsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/admin/approvals";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new AdminApprovalsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AdminApprovalsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getAdminApprovals.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AdminApprovalsBuilder.BASE_ROUTE, route: "/:businessId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getAdminApprovals$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AdminApprovalsBuilder.BASE_ROUTE, route: "/:businessId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putAdminApprovals$.bind(this.controller),
    );
  }
}
