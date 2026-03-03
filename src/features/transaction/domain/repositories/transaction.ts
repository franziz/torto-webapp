import { DataState } from "@/core/resources/data-state";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListTransactionsFilter {
  page?: number;
  limit?: number;
  assetId?: string;
  accountId?: string;
  transactionTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTransactionParams {
  assetId: string;
  transactionTypeId: string;
  units: number;
  pricePerUnit: number;
  totalAmount: number;
  fee: number;
  currency: string;
  transactionDate: string;
  notes?: string;
}

export interface TransactionRepository {
  list(filter: ListTransactionsFilter, session: SessionEntity): Promise<DataState<PaginatedData<TransactionEntity>>>;
  create(params: CreateTransactionParams, session: SessionEntity): Promise<DataState<TransactionEntity>>;
}
