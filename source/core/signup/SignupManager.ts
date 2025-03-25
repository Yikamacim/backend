import type { ManagerResponse } from "../../@types/responses";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper";
import type { IManager } from "../../app/interfaces/IManager";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { SignupProvider } from "./SignupProvider";
import type { SignupRequest } from "./schemas/SignupRequest";
import { SignupResponse } from "./schemas/SignupResponse";

export class SignupManager implements IManager {
  public constructor(private readonly provider = new SignupProvider()) {}

  public async postSignup(
    validatedData: SignupRequest,
  ): Promise<ManagerResponse<SignupResponse | null>> {
    // Try to get the account
    const prGetAccount = await this.provider.getAccount(validatedData.phone);
    // Account exists with phone, return conflict
    if (prGetAccount.data) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS)],
        null,
      );
    }
    // Create account
    const prCreateAccount = await this.provider.createAccount(
      validatedData.phone,
      await EncryptionHelper.encrypt(validatedData.password),
      validatedData.name,
      validatedData.surname,
      validatedData.accountType,
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      SignupResponse.fromModel(prCreateAccount.data),
    );
  }
}
