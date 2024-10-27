import type { ManagerResponse, ProviderResponse } from "../../@types/responses.d.ts";
import type { IManager } from "../../app/interfaces/IManager.ts";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.ts";
import { ResponseUtil } from "../../app/utils/ResponseUtil.ts";
import { RecordsProvider } from "./RecordsProvider.ts";
import type { RecordsResponse } from "./schemas/RecordsResponse.ts";

export class RecordsManager implements IManager {
  private readonly mProvider: RecordsProvider;

  constructor() {
    this.mProvider = new RecordsProvider();
  }

  public async getRecords(): Promise<ManagerResponse<RecordsResponse | null>> {
    // HAND OVER TO PROVIDER
    const providerResponse: ProviderResponse<RecordsResponse> = await this.mProvider.getRecords();
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      providerResponse.data,
    );
  }
}
