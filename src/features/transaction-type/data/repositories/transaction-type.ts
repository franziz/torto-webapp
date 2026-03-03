import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import {
  TransactionTypeRepository,
  ListTransactionTypesFilter,
} from "@/features/transaction-type/domain/repositories/transaction-type";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { TransactionTypeService } from "@/features/transaction-type/domain/sources/transaction-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class TransactionTypeRepositoryImpl implements TransactionTypeRepository {
  constructor(private readonly transactionTypeService: TransactionTypeService) {}

  public async list(
    filter: ListTransactionTypesFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<TransactionTypeEntity>>> {
    try {
      const result = await this.transactionTypeService.list({ page: filter.page, limit: filter.limit }, session);
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
