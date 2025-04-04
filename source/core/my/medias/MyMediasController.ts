import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { MediaType } from "../../../app/enums/MediaType";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MyMediasManager } from "./MyMediasManager";
import { MyMediasUploadParams } from "./schemas/MyMediasUploadParams";
import type { MyMediasUploadResponse } from "./schemas/MyMediasUploadResponse";

export class MyMediasController implements IController {
  public constructor(private readonly manager = new MyMediasManager()) {}

  public async getMyMediasUpload$mediaType(
    req: ExpressRequest,
    res: ControllerResponse<MyMediasUploadResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pr = MyMediasUploadParams.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.getMyMediasUpload$mediaType(
        tokenPayload.accountId,
        pr.validatedData.mediaType.toUpperCase() as MediaType,
      );
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
