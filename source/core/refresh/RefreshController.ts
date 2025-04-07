import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { PayloadHelper } from "../../app/helpers/PayloadHelper";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";

export class RefreshController implements IController {
  public async getRefresh(
    _: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< AUTHORIZATION >----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        null,
        await AuthModule.instance.refresh(payload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
