import { ItemModel } from "@/features/item/data/models/item";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListItemsServiceFilter {
  page?: number;
  limit?: number;
}

export interface ItemService {
  list(
    filter: ListItemsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: ItemModel[]; meta: PaginationMetaModel }>;
  get(id: string, session: SessionEntity): Promise<ItemModel>;
}
