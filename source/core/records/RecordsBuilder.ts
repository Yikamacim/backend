import { Router } from "express";
import { Method } from "../../app/enums/Method.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IBuilder } from "../../app/interfaces/IBuilder.ts";
import { RecordsController } from "./RecordsController.ts";

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
  }
}
