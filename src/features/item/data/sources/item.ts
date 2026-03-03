import { ItemService, ListItemsServiceFilter } from "@/features/item/domain/sources/item";
import { ItemModel } from "@/features/item/data/models/item";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ItemServiceImpl implements ItemService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListItemsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: ItemModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request({
        path: "/items",
        method: "GET",
        searchParams,
        session,
      });

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => ItemModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(id: string, session: SessionEntity): Promise<ItemModel> {
    try {
      const result = await this.http.request({
        path: `/items/${id}`,
        method: "GET",
        session,
      });

      return ItemModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
