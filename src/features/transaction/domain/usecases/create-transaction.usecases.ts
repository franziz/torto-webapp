import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { TransactionEntity } from "@/features/transaction/domain/entities/transaction";
import {
  TransactionRepository,
  CreateTransactionParams,
} from "@/features/transaction/domain/repositories/transaction";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CreateTransactionUseCaseParams {
  public assetId: string;
  public transactionTypeId: string;
  public units: number;
  public pricePerUnit: number;
  public totalAmount: number;
  public currency: string;
  public transactionDate: string;
  public notes?: string;

  constructor(args: {
    assetId: string;
    transactionTypeId: string;
    units: number;
    pricePerUnit: number;
    totalAmount: number;
    currency: string;
    transactionDate: string;
    notes?: string;
  }) {
    this.assetId = args.assetId;
    this.transactionTypeId = args.transactionTypeId;
    this.units = args.units;
    this.pricePerUnit = args.pricePerUnit;
    this.totalAmount = args.totalAmount;
    this.currency = args.currency;
    this.transactionDate = args.transactionDate;
    this.notes = args.notes;
  }
}

export class CreateTransactionUseCase
  implements UseCase<DataState<TransactionEntity>, CreateTransactionUseCaseParams>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateTransactionUseCaseParams): Promise<DataState<TransactionEntity>> {
    try {
      const session = await this.retrieveSession();
      const createParams: CreateTransactionParams = {
        assetId: params.assetId,
        transactionTypeId: params.transactionTypeId,
        units: params.units,
        pricePerUnit: params.pricePerUnit,
        totalAmount: params.totalAmount,
        currency: params.currency,
        transactionDate: params.transactionDate,
        notes: params.notes,
      };
      return this.transactionRepository.create(createParams, session);
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
