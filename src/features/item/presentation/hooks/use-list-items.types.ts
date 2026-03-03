import { useClerk } from "@clerk/nextjs";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListItemsParams = {
  page?: number;
  limit?: number;
};

export type ListItemsFetcherParams = UseListItemsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  items: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  items: ItemEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  items: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListItemsReturnType = InitialState | LoadedState | ErrorState;
