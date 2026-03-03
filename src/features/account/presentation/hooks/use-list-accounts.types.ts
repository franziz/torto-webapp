import { useClerk } from "@clerk/nextjs";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListAccountsParams = {
  page?: number;
  limit?: number;
};

export type ListAccountsFetcherParams = UseListAccountsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  accounts: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  accounts: AccountEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  accounts: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListAccountsReturnType = InitialState | LoadedState | ErrorState;
