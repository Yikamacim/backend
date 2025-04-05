import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { ArrayUtil } from "../../app/utils/ArrayUtil";

export class MediaIdsValidator implements IValidator {
  public static validate(data: number[], validationErrors: ClientError[]): void {
    if (ArrayUtil.hasDuplicates(data)) {
      validationErrors.push(new ClientError(ClientErrorCode.DUPLICATE_MEDIA_IDS));
    }
  }
}
