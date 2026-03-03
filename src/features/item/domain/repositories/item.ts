import { DataState } from "@/core/resources/data-state";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListItemsFilter {
  page?: number;
  limit?: number;
}

export interface ItemRepository {
  list(filter: ListItemsFilter, session: SessionEntity): Promise<DataState<PaginatedData<ItemEntity>>>;
  get(id: string, session: SessionEntity): Promise<DataState<ItemEntity>>;
}
