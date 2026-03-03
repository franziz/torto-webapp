import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import {
  TransactionRepository,
  ListTransactionsFilter,
  CreateTransactionParams,
} from "@/features/transaction/domain/repositories/transaction";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { TransactionService } from "@/features/transaction/domain/sources/transaction";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(private readonly transactionService: TransactionService) {}

  public async list(
    filter: ListTransactionsFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<TransactionEntity>>> {
    try {
      const result = await this.transactionService.list(
        {
          page: filter.page,
          limit: filter.limit,
          assetId: filter.assetId,
          accountId: filter.accountId,
          transactionTypeId: filter.transactionTypeId,
          dateFrom: filter.dateFrom,
          dateTo: filter.dateTo,
        },
        session,
      );
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(
    params: CreateTransactionParams,
    session: SessionEntity,
  ): Promise<DataState<TransactionEntity>> {
    try {
      const result = await this.transactionService.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
