import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { MySessionsProvider } from "./MySessionsProvider";
import { MySessionsResponse } from "./schemas/MySessionsResponse";

export class MySessionsManager implements IManager {
  public constructor(private readonly provider = new MySessionsProvider()) {}

  public async getMySessions(
    accountId: number,
    currentSessionId: number,
  ): Promise<ManagerResponse<MySessionsResponse[]>> {
    // Try to get the account
    const prGetMySessions = await this.provider.getMySessions(accountId);
    // Return sessions
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      MySessionsResponse.fromModels(prGetMySessions.data, currentSessionId),
    );
  }

  public async deleteMySessions(
    accountId: number,
    sessionId: number,
  ): Promise<ManagerResponse<null>> {
    // Try to get the account
    const prGetMySession = await this.provider.getMySession(accountId, sessionId);
    // Check if session exists
    if (!prGetMySession.data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.SESSION_NOT_FOUND)],
        null,
      );
    }
    // Check if session is the current session
    if (prGetMySession.data.sessionId === sessionId) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.CANNOT_DELETE_CURRENT_SESSION)],
        null,
      );
    }
    // Delete session
    await this.provider.deleteSession(sessionId);
    // Return success
    return ResponseUtil.managerResponse(new HttpStatus(HttpStatusCode.NO_CONTENT), null, [], null);
  }
}
