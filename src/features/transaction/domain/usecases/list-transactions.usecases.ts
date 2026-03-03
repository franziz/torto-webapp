import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import { TransactionRepository } from "@/features/transaction/domain/repositories/transaction";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListTransactionsUseCaseParams {
  public page?: number;
  public limit?: number;
  public assetId?: string;
  public accountId?: string;
  public transactionTypeId?: string;
  public dateFrom?: string;
  public dateTo?: string;

  constructor(args: {
    page?: number;
    limit?: number;
    assetId?: string;
    accountId?: string;
    transactionTypeId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    this.page = args.page;
    this.limit = args.limit;
    this.assetId = args.assetId;
    this.accountId = args.accountId;
    this.transactionTypeId = args.transactionTypeId;
    this.dateFrom = args.dateFrom;
    this.dateTo = args.dateTo;
  }
}

export class ListTransactionsUseCase
  implements UseCase<DataState<PaginatedData<TransactionEntity>>, ListTransactionsUseCaseParams>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListTransactionsUseCaseParams): Promise<DataState<PaginatedData<TransactionEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.transactionRepository.list(
        {
          page: params.page,
          limit: params.limit,
          assetId: params.assetId,
          accountId: params.accountId,
          transactionTypeId: params.transactionTypeId,
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
        session,
      );
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
