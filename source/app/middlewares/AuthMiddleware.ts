import type { MiddlewareResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { AccountType } from "../../common/enums/AccountType";
import { AuthModule } from "../../modules/auth/module";
import { LocalsConstants } from "../constants/LocalsConstants";
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
        const pt = HeadersUtil.parseToken(req);
        if (pt.clientErrors.length > 0 || pt.data === null) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            pt.clientErrors,
          );
        }
        // >-----------< LOGIC >-----------<
        const verificationErrors = await AuthModule.instance.verify(pt.data);
        if (verificationErrors.length > 0) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.UNAUTHORIZED),
            null,
            verificationErrors,
          );
        }
        // Payload extraction
        const payload = AuthModule.instance.getPayload(pt.data);
        // Authorization check
        if (!allowedAccountTypes.includes(payload.accountType)) {
          // Forbidden access
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.FORBIDDEN),
            null,
            [new ClientError(ClientErrorCode.FORBIDDEN_ACCESS)],
          );
        }
        res.locals[LocalsConstants.TOKEN_PAYLOAD] = payload;
        // >----------< CONTINUE >----------<
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}
