import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { RecordsController } from "./RecordsController";

export class RecordsBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "records";

  public readonly router: Router;

  private readonly mController: RecordsController;

  constructor() {
    this.router = Router();
    this.mController = new RecordsController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RecordsBuilder.BASE_ROUTE, route: "/" },
      Method.GET,
      this.mController.getRecords.bind(this.mController),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RecordsBuilder.BASE_ROUTE, route: "/" },
      Method.DELETE,
      this.mController.deleteRecords.bind(this.mController),
    );
  }
}
