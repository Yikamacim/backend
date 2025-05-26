import type { ProviderResponse } from "../../../@types/responses";
import { DbConstants } from "../../../app/constants/DbConstants";
import type { IProvider } from "../../../app/interfaces/IProvider";
import { UnexpectedDatabaseStateError } from "../../../app/schemas/ServerError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import type { ECurtainType } from "../../../common/enums/ECurtainType";
import { CurtainModel } from "../../../common/models/CurtainModel";
import { CurtainViewModel } from "../../../common/models/CurtainViewModel";
import { ItemMediaProvider } from "../../../common/providers/ItemMediaProvider";
import { ItemProvider } from "../../../common/providers/ItemProvider";
import { CurtainQueries } from "../../../common/queries/CurtainQueries";
import { CurtainViewQueries } from "../../../common/queries/CurtainViewQueries";

export class MyCurtainsProvider implements IProvider {
  public constructor(
    private readonly itemProvider = new ItemProvider(),
    private readonly itemMediaProvider = new ItemMediaProvider(),
  ) {
    this.partialCreateMyItem = this.itemProvider.partialCreateMyItem.bind(this.itemProvider);
    this.partialUpdateItem = this.itemProvider.partialUpdateItem.bind(this.itemProvider);
    this.archiveItem = this.itemProvider.archiveItem.bind(this.itemProvider);
    this.getItemMedias = this.itemMediaProvider.getItemMedias.bind(this.itemMediaProvider);
    this.partialCreateItemMedias = this.itemMediaProvider.partialCreateItemMedias.bind(
      this.itemMediaProvider,
    );
    this.partialDeleteItemMedias = this.itemMediaProvider.partialDeleteItemMedias.bind(
      this.itemMediaProvider,
    );
  }

  public readonly getItemMedias: typeof this.itemMediaProvider.getItemMedias;
  public readonly archiveItem: typeof this.itemProvider.archiveItem;

  private readonly partialCreateMyItem: typeof this.itemProvider.partialCreateMyItem;
  private readonly partialUpdateItem: typeof this.itemProvider.partialUpdateItem;
  private readonly partialCreateItemMedias: typeof this.itemMediaProvider.partialCreateItemMedias;
  private readonly partialDeleteItemMedias: typeof this.itemMediaProvider.partialDeleteItemMedias;

  public async getMyActiveCurtains(
    accountId: number,
  ): Promise<ProviderResponse<CurtainViewModel[]>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAINS_$ACID_$ISDEL, [
        accountId,
        false,
      ]);
      const records: unknown[] = results.rows;
      return await ResponseUtil.providerResponse(CurtainViewModel.fromRecords(records));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getMyActiveCurtain(
    accountId: number,
    curtainId: number,
  ): Promise<ProviderResponse<CurtainViewModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(
        CurtainViewQueries.GET_CURTAIN_$ACID_$CRID_$ISDEL,
        [accountId, curtainId, false],
      );
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return null;
      }
      return CurtainViewModel.fromRecord(record);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async createMyCurtain(
    accountId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    curtainType: ECurtainType | null,
  ): Promise<ProviderResponse<CurtainViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const item = await this.partialCreateMyItem(accountId, name, description);
      const curtain = await this.partialCreateCurtain(item.itemId, width, length, curtainType);
      await this.partialCreateItemMedias(item.itemId, mediaIds);
      const curtainView = await this.partialGetActiveCurtain(curtain.curtainId);
      if (curtainView === null) {
        throw new UnexpectedDatabaseStateError("Curtain was not created");
      }
      return await ResponseUtil.providerResponse(curtainView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async updateCurtain(
    oldMediaIds: number[],
    carpetId: number,
    itemId: number,
    name: string,
    description: string,
    mediaIds: number[],
    width: number | null,
    length: number | null,
    curtainType: ECurtainType | null,
  ): Promise<ProviderResponse<CurtainViewModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      await this.partialDeleteItemMedias(itemId, oldMediaIds);
      await this.partialUpdateItem(itemId, name, description);
      await this.partialUpdateCurtain(carpetId, width, length, curtainType);
      await this.partialCreateItemMedias(itemId, mediaIds);
      const curtainView = await this.partialGetActiveCurtain(carpetId);
      if (curtainView === null) {
        throw new UnexpectedDatabaseStateError("Curtain was not updated");
      }
      return await ResponseUtil.providerResponse(curtainView);
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  // >-----------------------------------< PARTIAL METHODS >------------------------------------< //

  private async partialGetActiveCurtain(curtainId: number): Promise<CurtainViewModel | null> {
    const results = await DbConstants.POOL.query(CurtainViewQueries.GET_CURTAIN_$CRID_$ISDEL, [
      curtainId,
      false,
    ]);
    const record: unknown = results.rows[0];
    if (!ProtoUtil.isProtovalid(record)) {
      return null;
    }
    return CurtainViewModel.fromRecord(record);
  }

  private async partialCreateCurtain(
    itemId: number,
    width: number | null,
    length: number | null,
    curtainType: ECurtainType | null,
  ): Promise<CurtainModel> {
    const results = await DbConstants.POOL.query(
      CurtainQueries.INSERT_CURTAIN_RT_$ITID_$WIDTH_$LENGTH_$CTYP,
      [itemId, width, length, curtainType],
    );
    const record: unknown = results.rows[0];
    return CurtainModel.fromRecord(record);
  }

  private async partialUpdateCurtain(
    curtainId: number,
    width: number | null,
    length: number | null,
    curtainType: ECurtainType | null,
  ): Promise<CurtainModel> {
    const results = await DbConstants.POOL.query(
      CurtainQueries.UPDATE_CURTAIN_RT_$CPID_$WIDTH_$LENGTH_$CTYP,
      [curtainId, width, length, curtainType],
    );
    const record: unknown = results.rows[0];
    return CurtainModel.fromRecord(record);
  }
}
