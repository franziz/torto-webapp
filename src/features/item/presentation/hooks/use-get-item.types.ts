import { useClerk } from "@clerk/nextjs";
import { ItemEntity } from "@/features/item/domain/entities/item";
import { ServerError } from "@/core/resources/server-error";

export type UseGetItemParams = {
  id: string;
};

export type GetItemFetcherParams = UseGetItemParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  item: null;
  loading: true;
  error: null;
};

type LoadedState = {
  item: ItemEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  item: null;
  loading: false;
  error: ServerError;
};

export type UseGetItemReturnType = InitialState | LoadedState | ErrorState;
