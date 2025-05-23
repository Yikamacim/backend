import type { ManagerResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { LoginProvider } from "./LoginProvider";
import type { LoginRequest } from "./schemas/LoginRequest";
import { LoginResponse } from "./schemas/LoginResponse";

export class LoginManager implements IManager {
  public constructor(private readonly provider = new LoginProvider()) {}

  public async postLogin(request: LoginRequest): Promise<ManagerResponse<LoginResponse | null>> {
    const account = await this.provider.getAccountByPhone(request.phone);
    if (account === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_NOT_FOUND)],
        null,
      );
    }
    if (!(await EncryptionHelper.isMatching(request.password, account.password))) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.INCORRECT_PASSWORD)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      LoginResponse.fromModel(account),
    );
  }
}
