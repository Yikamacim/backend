import type { MiddlewareResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { AuthModule } from "../../modules/auth/module";
import { LocalsConstants } from "../constants/LocalsConstants";
import type { AccountType } from "../enums/AccountType";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { HeadersUtil } from "../utils/HeadersUtil";
import { ResponseUtil } from "../utils/ResponseUtil";

export class AuthMiddleware {
  public static verifyAuth(allowedAccountTypes: AccountType[]) {
    return async (
      req: ExpressRequest,
      res: MiddlewareResponse,
      next: ExpressNextFunction,
    ): Promise<typeof res | void> => {
      try {
        // >----------< VALIDATION >----------<
        const pr = HeadersUtil.parseToken(req);
        if (pr.clientErrors.length > 0 || pr.validatedData === null) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            pr.clientErrors,
          );
        }
        // >-----------< LOGIC >-----------<
        const verificationErrors = await AuthModule.instance.verify(pr.validatedData);
        // If there are verification errors
        if (verificationErrors.length > 0) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.UNAUTHORIZED),
            null,
            verificationErrors,
          );
        }
        // Payload extraction
        const tokenPayload = AuthModule.instance.getPayload(pr.validatedData);
        // Authorization check
        if (!allowedAccountTypes.includes(tokenPayload.accountType)) {
          // Forbidden access
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.FORBIDDEN),
            null,
            [new ClientError(ClientErrorCode.FORBIDDEN_ACCESS)],
          );
        }
        res.locals[LocalsConstants.TOKEN_PAYLOAD] = tokenPayload;
        // >----------< CONTINUE >----------<
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}
