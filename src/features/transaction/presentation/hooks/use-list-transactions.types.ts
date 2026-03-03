import { useClerk } from "@clerk/nextjs";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";

export type UseListTransactionsParams = {
  page?: number;
  limit?: number;
  assetId?: string;
  accountId?: string;
  transactionTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ListTransactionsFetcherParams = UseListTransactionsParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  transactions: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  transactions: TransactionEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  transactions: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListTransactionsReturnType = InitialState | LoadedState | ErrorState;
