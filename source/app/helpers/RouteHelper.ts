import type { ControllerResponse } from "../../@types/responses.d.ts";
import type { Tokens } from "../../@types/tokens.d.ts";
import type { FullRoute } from "../../@types/utils.d.ts";
import type {
  ExpressNextFunction,
  ExpressRequest,
  ExpressRouter,
} from "../../@types/wrappers.d.ts";
import { Method } from "../enums/Method.ts";
import type { IHelper } from "../interfaces/IHelper.ts";
import type { IResponse } from "../interfaces/IResponse.ts";

export class RouteHelper implements IHelper {
  private static routeMethodMap: Map<string, Method[]> = new Map<string, Method[]>();

  public static buildRoute<D extends IResponse | null, T extends Tokens | null>(
    router: ExpressRouter,
    fullRoute: FullRoute,
    method: Method,
    handler: (
      req: ExpressRequest,
      res: ControllerResponse<D, T>,
      next: ExpressNextFunction,
    ) => Promise<ControllerResponse<D, T> | void>,
  ): void {
    RouteHelper.addRoute(this.concatRoute(fullRoute));
    switch (method) {
      case Method.GET:
        router.get(fullRoute.route, handler);
        RouteHelper.addMethod(this.concatRoute(fullRoute), Method.GET);
        break;
      case Method.POST:
        router.post(fullRoute.route, handler);
        RouteHelper.addMethod(this.concatRoute(fullRoute), Method.POST);
        break;
      case Method.PUT:
        router.put(fullRoute.route, handler);
        RouteHelper.addMethod(this.concatRoute(fullRoute), Method.PUT);
        break;
      case Method.DELETE:
        router.delete(fullRoute.route, handler);
        RouteHelper.addMethod(this.concatRoute(fullRoute), Method.DELETE);
        break;
    }
  }

  public static addRoute(route: string): void {
    RouteHelper.routeMethodMap.set(route, []);
  }

  public static addMethod(route: string, method: Method): void {
    const routeMethods: Method[] | undefined = RouteHelper.routeMethodMap.get(route);
    if (!routeMethods) {
      RouteHelper.routeMethodMap.set(route, []).get(route)!.push(method);
    } else {
      routeMethods.push(method);
    }
  }

  public static getMethods(route: string): Method[] | null {
    const routeMethods: Method[] | undefined = RouteHelper.routeMethodMap.get(route);
    return routeMethods ? routeMethods : null;
  }

  private static concatRoute(fullRoute: FullRoute): string {
    return `${fullRoute.baseRoute}${fullRoute.route}`;
  }
}
