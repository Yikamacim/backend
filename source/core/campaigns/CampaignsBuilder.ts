// import { Router } from "express";
// import { Method } from "../../app/enums/Method";
// import { RouteType } from "../../app/enums/RouteType";
// import { RouteHelper } from "../../app/helpers/RouteHelper";
// import type { IBuilder } from "../../app/interfaces/IBuilder";
// import { CampaignsController } from "./CampaignsController";

// export class CampaignsBuilder implements IBuilder {
//   public static readonly BASE_ROUTE = "/campaigns";

//   public constructor(
//     public readonly router = Router({ mergeParams: true }),
//     private readonly controller = new CampaignsController(),
//   ) {
//     this.buildRoutes();
//   }

//   private buildRoutes(): void {
//     RouteHelper.buildRoute(
//       this.router,
//       { baseRoute: CampaignsBuilder.BASE_ROUTE, route: "/:neighborhoodId" },
//       RouteType.PUBLIC,
//       Method.GET,
//       this.controller.getCampaigns.bind(this.controller),
//     );
//   }
// }
