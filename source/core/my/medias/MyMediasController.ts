import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { MediaType } from "../../../common/enums/MediaType";
import { AuthModule } from "../../../modules/auth/module";
import { MyMediasManager } from "./MyMediasManager";
import { MyMediasUploadParams } from "./schemas/MyMediasUploadParams";
import { MyMediasUploadQueries } from "./schemas/MyMediasUploadQueries";
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
      const pp = MyMediasUploadParams.parse(req);
      if (pp.clientErrors.length > 0 || pp.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pp.clientErrors,
          null,
          null,
        );
      }
      const pq = MyMediasUploadQueries.parse(req);
      if (pq.clientErrors.length > 0 || pq.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pq.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.getMyMediasUpload$mediaType(
        tokenPayload.accountId,
        pp.validatedData.mediaType.toUpperCase() as MediaType,
        pq.validatedData.extension,
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
