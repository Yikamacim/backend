import type { ManagerResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AccountEntity } from "../../common/entities/AccountEntity";
import { EAccountType } from "../../common/enums/EAccountType";
import { SignupProvider } from "./SignupProvider";
import type { SignupRequest } from "./schemas/SignupRequest";
import { SignupResponse } from "./schemas/SignupResponse";

export class SignupManager implements IManager {
  public constructor(private readonly provider = new SignupProvider()) {}

  public async postSignup(request: SignupRequest): Promise<ManagerResponse<SignupResponse | null>> {
    if (request.accountType === EAccountType.ADMIN) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.FORBIDDEN_ACCOUNT_TYPE)],
        null,
      );
    }
    if ((await this.provider.getAccountByPhone(request.phone)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS)],
        null,
      );
    }
    const account = await this.provider.createAccount(
      request.phone,
      await EncryptionHelper.encrypt(request.password),
      request.name,
      request.surname,
      request.accountType,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      SignupResponse.fromEntity(new AccountEntity(account)),
    );
  }
}
