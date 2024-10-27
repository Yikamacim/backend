import type { ManagerResponse, ProviderResponse } from "../../@types/responses";
import type { IManager } from "../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { RecordsProvider } from "./RecordsProvider";
import type { RecordsResponse } from "./schemas/RecordsResponse";

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
