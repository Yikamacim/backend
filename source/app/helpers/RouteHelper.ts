import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { FullRoute } from "../../@types/utils";
import type { ExpressNextFunction, ExpressRequest, ExpressRouter } from "../../@types/wrappers";
import { ConfigConstants } from "../constants/ConfigConstants";
import { Method } from "../enums/Method";
import type { IHelper } from "../interfaces/IHelper";
import type { IResponse } from "../interfaces/IResponse";

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

  public static getEndpoints(): string[] {
    const endpoints: string[] = [];
    RouteHelper.routeMethodMap.forEach((methods: Method[], route: string) => {
      const methodsList = methods.map((method) => `"${method}"`).join(", ");
      endpoints.push(`Route: "${ConfigConstants.API_PREFIX}/${route}" | Methods: [${methodsList}]`);
    });
    return endpoints;
  }

  public static getMethods(url: string): Method[] | null {
    const route: string = url.replace(`${ConfigConstants.API_PREFIX}/`, "");
    const routeParts: string[] = route.split("/");
    let methods: Method[] | null = null;
    this.routeMethodMap.forEach((apiMethods: Method[], apiRoute: string) => {
      const apiRouteParts: string[] = apiRoute.split("/").filter((part: string) => part !== "");
      if (apiRouteParts.length !== routeParts.length) {
        return;
      }
      let isMatch = true;
      apiRouteParts.forEach((apiRoutePart: string, index: number) => {
        if (apiRoutePart !== routeParts[index]) {
          if (!apiRoutePart.startsWith(":")) {
            isMatch = false;
            return;
          }
        }
      });
      if (isMatch) {
        methods = apiMethods;
        return;
      }
    });
    return methods;
  }

  private static concatRoute(fullRoute: FullRoute): string {
    return `${fullRoute.baseRoute}${fullRoute.route}`;
  }
}
