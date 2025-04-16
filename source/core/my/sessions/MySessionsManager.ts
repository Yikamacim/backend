import type { ManagerResponse } from "../../../@types/responses";
import type { TokenPayload } from "../../../@types/tokens";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MySessionsProvider } from "./MySessionsProvider";
import type { MySessionsParams } from "./schemas/MySessionsParams";
import { MySessionsResponse } from "./schemas/MySessionsResponse";

export class MySessionsManager implements IManager {
  public constructor(private readonly provider = new MySessionsProvider()) {}

  public async getMySessions(
    payload: TokenPayload,
  ): Promise<ManagerResponse<MySessionsResponse[]>> {
    const mySessions = await this.provider.getMySessions(payload.accountId);
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySessionsResponse.fromModels(mySessions, payload.sessionId),
    );
  }

  public async deleteMySessions$(
    payload: TokenPayload,
    params: MySessionsParams,
  ): Promise<ManagerResponse<null>> {
    if (parseInt(params.sessionId) === payload.sessionId) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_CURRENT_SESSION)],
        null,
      );
    }
    const mySession = await this.provider.getMySession(
      payload.accountId,
      parseInt(params.sessionId),
    );
    if (mySession === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SESSION_NOT_FOUND)],
        null,
      );
    }
    await this.provider.deleteSession(mySession.sessionId);
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.OK), null, [], null);
  }
}
