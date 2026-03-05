import { TransactionModel } from "@/features/transaction/data/models/transaction";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListTransactionsServiceFilter {
  page?: number;
  limit?: number;
  assetId?: string;
  accountId?: string;
  transactionTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateTransactionServiceParams {
  assetId: string;
  transactionTypeId: string;
  units: number;
  pricePerUnit: number;
  totalAmount: number;
  currency: string;
  transactionDate: string;
  notes?: string;
}

export interface TransactionService {
  list(
    filter: ListTransactionsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: TransactionModel[]; meta: PaginationMetaModel }>;
  create(params: CreateTransactionServiceParams, session: SessionEntity): Promise<TransactionModel>;
}
