import type { ProviderResponse } from "../../@types/responses";
import { LogHelper } from "../../app/helpers/LogHelper";
import type { IProvider } from "../../app/interfaces/IProvider";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import type { RecordsResponse } from "./schemas/RecordsResponse";

export class RecordsProvider implements IProvider {
  public getRecords(): Promise<ProviderResponse<RecordsResponse>> {
    return ResponseUtil.providerResponse(LogHelper.getRecords(), false);
  }

  public deleteRecords(): Promise<ProviderResponse<null>> {
    LogHelper.deleteRecords();
    return ResponseUtil.providerResponse(null, false);
  }
}
