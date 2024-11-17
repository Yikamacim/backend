import type { MiddlewareResponse } from "../../@types/responses";
import type { Token } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { AuthModule } from "../../modules/auth/module";
import type { AccountType } from "../enums/AccountType";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { HeadersUtil } from "../utils/HeadersUtil";
import { ProtoUtil } from "../utils/ProtoUtil";
import { ResponseUtil } from "../utils/ResponseUtil";

export class AuthMiddleware {
  public static verifyAuth(allowedAccountTypes: AccountType[]) {
    return async (
      req: ExpressRequest,
      res: MiddlewareResponse,
      next: ExpressNextFunction,
    ): Promise<MiddlewareResponse | void> => {
      try {
        const preliminaryData: unknown = req.headers;
        // V1: Existence validation
        if (!ProtoUtil.isProtovalid(preliminaryData)) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            [new ClientError(ClientErrorCode.MISSING_HEADERS)],
          );
        }
        const protovalidData: unknown = preliminaryData;
        // V2: Schematic validation
        if (!HeadersUtil.isBlueprint(protovalidData, "authorization", "string")) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            [new ClientError(ClientErrorCode.INVALID_HEADERS)],
          );
        }
        const blueprintData: string = protovalidData.authorization!;
        // V3: Physical validation
        const validationErrors: ClientError[] = HeadersUtil.getAuthValidationErrors(blueprintData);
        if (validationErrors.length > 0) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            validationErrors,
          );
        }
        const validatedData: Token = blueprintData.split(" ")[1]!;
        // V4: Logical validation
        const hrClientErrors = await AuthModule.instance.verify(validatedData);
        if (hrClientErrors.length > 0) {
          // Unauthorized access
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.UNAUTHORIZED),
            null,
            hrClientErrors,
          );
        }
        // Payload extraction
        const hrTokenPayload = AuthModule.instance.getPayload(validatedData);
        // Authorization check
        if (!allowedAccountTypes.includes(hrTokenPayload.accountType)) {
          // Forbidden access
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.FORBIDDEN),
            null,
            [new ClientError(ClientErrorCode.FORBIDDEN_ACCESS)],
          );
        }
        res.locals["tokenPayload"] = hrTokenPayload;
        // >----------< CONTINUE >----------<
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}
