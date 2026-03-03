import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { TransactionTypeRepository } from "@/features/transaction-type/domain/repositories/transaction-type";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListTransactionTypesUseCaseParams {
  public page?: number;
  public limit?: number;

  constructor(args: { page?: number; limit?: number }) {
    this.page = args.page;
    this.limit = args.limit;
  }
}

export class ListTransactionTypesUseCase
  implements UseCase<DataState<PaginatedData<TransactionTypeEntity>>, ListTransactionTypesUseCaseParams>
{
  constructor(
    private readonly transactionTypeRepository: TransactionTypeRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(
    params: ListTransactionTypesUseCaseParams,
  ): Promise<DataState<PaginatedData<TransactionTypeEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.transactionTypeRepository.list({ page: params.page, limit: params.limit }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
