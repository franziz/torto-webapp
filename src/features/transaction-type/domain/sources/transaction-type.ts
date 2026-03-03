import { TransactionTypeModel } from "@/features/transaction-type/data/models/transaction-type";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListTransactionTypesServiceFilter {
  page?: number;
  limit?: number;
}

export interface TransactionTypeService {
  list(
    filter: ListTransactionTypesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: TransactionTypeModel[]; meta: PaginationMetaModel }>;
}
