import type { ManagerResponse } from "../../../@types/responses";
import type { IManager } from "../../../app/interfaces/IManager";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { RecordsProvider } from "./RecordsProvider";
import type { RecordsResponse } from "./schemas/RecordsResponse";

export class RecordsManager implements IManager {
  public constructor(private readonly provider = new RecordsProvider()) {}

  public async getRecords(): Promise<ManagerResponse<RecordsResponse>> {
    // Get records
    const prGetRecords = await this.provider.getRecords();
    // Return records
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      prGetRecords.data,
    );
  }

  public async deleteRecords(): Promise<ManagerResponse<null>> {
    // Delete records
    const prDeleteRecords = await this.provider.deleteRecords();
    // Return null
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.NO_CONTENT),
      null,
      [],
      prDeleteRecords.data,
    );
  }
}
