import {
  TransactionService,
  ListTransactionsServiceFilter,
  CreateTransactionServiceParams,
} from "@/features/transaction/domain/sources/transaction";
import { TransactionModel } from "@/features/transaction/data/models/transaction";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class TransactionServiceImpl implements TransactionService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListTransactionsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: TransactionModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);
      if (filter.assetId) searchParams.asset_id = filter.assetId;
      if (filter.accountId) searchParams.account_id = filter.accountId;
      if (filter.transactionTypeId) searchParams.transaction_type_id = filter.transactionTypeId;
      if (filter.dateFrom) searchParams.date_from = filter.dateFrom;
      if (filter.dateTo) searchParams.date_to = filter.dateTo;

      const result = await this.http.request(
        {
          path: "/api/transactions",
          method: "GET",
          searchParams,
          session,
        },
        { requireAccount: false },
      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => TransactionModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateTransactionServiceParams, session: SessionEntity): Promise<TransactionModel> {
    try {
      const result = await this.http.request(
        {
          path: "/api/transactions",
          method: "POST",
          body: {
            asset_id: params.assetId,
            transaction_type_id: params.transactionTypeId,
            units: params.units,
            price_per_unit: params.pricePerUnit,
            total_amount: params.totalAmount,
            fee: params.fee,
            currency: params.currency,
            transaction_date: params.transactionDate,
            notes: params.notes,
          },
          session,
        },
        { requireAccount: false },
      );

      return TransactionModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
