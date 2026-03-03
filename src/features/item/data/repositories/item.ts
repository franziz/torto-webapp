import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ItemRepository, ListItemsFilter } from "@/features/item/domain/repositories/item";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ItemService } from "@/features/item/domain/sources/item";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ItemRepositoryImpl implements ItemRepository {
  constructor(private readonly itemService: ItemService) {}

  public async list(filter: ListItemsFilter, session: SessionEntity): Promise<DataState<PaginatedData<ItemEntity>>> {
    try {
      const result = await this.itemService.list({ page: filter.page, limit: filter.limit }, session);
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(id: string, session: SessionEntity): Promise<DataState<ItemEntity>> {
    try {
      const result = await this.itemService.get(id, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
