import type { ProviderResponse } from "../../../@types/responses";
import type { IModel } from "../../../app/interfaces/IModel";

export type HandlerResponse<D extends IModel | boolean | null> = ProviderResponse<D>;
