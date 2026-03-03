import { useClerk } from "@clerk/nextjs";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListTransactionTypesParams = {
  page?: number;
  limit?: number;
};

export type ListTransactionTypesFetcherParams = UseListTransactionTypesParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  transactionTypes: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  transactionTypes: TransactionTypeEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  transactionTypes: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListTransactionTypesReturnType = InitialState | LoadedState | ErrorState;
