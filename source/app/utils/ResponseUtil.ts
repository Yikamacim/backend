import type {
  ControllerResponse,
  ManagerResponse,
  MiddlewareResponse,
  ParserResponse,
  ProviderResponse,
} from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import { DbConstants } from "../constants/DbConstants";
import { LogHelper } from "../helpers/LogHelper";
import type { IModel } from "../interfaces/IModel";
import type { IParams } from "../interfaces/IParams";
import type { IQueries } from "../interfaces/IQueries";
import type { IRequest } from "../interfaces/IRequest";
import type { IResponse } from "../interfaces/IResponse";
import type { IUtil } from "../interfaces/IUtil";
import type { ClientError } from "../schemas/ClientError";
import type { HttpStatus } from "../schemas/HttpStatus";
import type { ServerError } from "../schemas/ServerError";

export class ResponseUtil implements IUtil {
  public static controllerResponse<
    DO extends IResponse | null,
    TO extends Tokens | null,
    D extends DO,
    T extends TO,
  >(
    res: ControllerResponse<DO, TO>,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
    tokens: T,
    log = true,
  ): typeof res {
    const body = {
      httpStatus,
      serverError,
      clientErrors,
      data,
      tokens,
    };
    if (log) {
      if (body.clientErrors.length > 0) {
        LogHelper.warning("(Client) Errors occurred:");
        body.clientErrors.forEach((error) => {
          LogHelper.detail(`${error.code} - ${error.message}`, 1);
        });
      }
      LogHelper.log("Response was:");
      LogHelper.detail(JSON.stringify(body, null, 2), 1);
    } else {
      LogHelper.log("Response was:");
      LogHelper.detail("Hidden", 1);
    }
    return res.status(httpStatus.code).send(body);
  }

  public static parserResponse<T extends IRequest | IParams | IQueries | null>(
    clientErrors: ClientError[],
    validatedData: T,
  ): ParserResponse<T> {
    return {
      clientErrors,
      validatedData,
    };
  }

  public static middlewareResponse(
    res: MiddlewareResponse,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
  ): typeof res {
    return this.controllerResponse(res, httpStatus, serverError, clientErrors, null, null);
  }

  public static managerResponse<D extends IResponse | null>(
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
  ): ManagerResponse<D> {
    return {
      httpStatus,
      serverError,
      clientErrors,
      data,
    };
  }

  public static async providerResponse<D extends IModel | boolean | null>(
    data: D,
    log = true,
  ): Promise<ProviderResponse<D>> {
    await DbConstants.POOL.query(DbConstants.COMMIT);
    if (log) {
      LogHelper.log("Provider response was:");
      LogHelper.detail(JSON.stringify(data, null, 2), 1);
    }
    else {
      LogHelper.log("Provider response was:");
      LogHelper.detail("Hidden", 1);
    }
    return {
      data,
    };
  }
}
