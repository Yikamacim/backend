import type { ProviderResponse } from "../../@types/responses.d.ts";
import { LogHelper } from "../../app/helpers/LogHelper.ts";
import type { IProvider } from "../../app/interfaces/IProvider.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import type { RecordsResponse } from "./schemas/RecordsResponse.ts";

export class RecordsProvider implements IProvider {
  public getRecords(): Promise<ProviderResponse<RecordsResponse>> {
    return ResponseUtil.providerResponse(LogHelper.getRecords(), false);
  }
}
