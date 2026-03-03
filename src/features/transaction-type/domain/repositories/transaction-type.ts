import { DataState } from "@/core/resources/data-state";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListTransactionTypesFilter {
  page?: number;
  limit?: number;
}

export interface TransactionTypeRepository {
  list(
    filter: ListTransactionTypesFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<TransactionTypeEntity>>>;
}
