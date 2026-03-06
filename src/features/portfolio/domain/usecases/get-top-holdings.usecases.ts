import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { TopHoldingEntity } from "@/features/portfolio/domain/entities/top-holding";
import { TopHoldingRepository } from "@/features/portfolio/domain/repositories/top-holding";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetTopHoldingsUseCaseParams {
  public currency?: string;
  public displayCurrency?: string;
  public limit?: number;

  constructor(args: { currency?: string; displayCurrency?: string; limit?: number }) {
    this.currency = args.currency;
    this.displayCurrency = args.displayCurrency;
    this.limit = args.limit;
  }
}

export class GetTopHoldingsUseCase
  implements UseCase<DataState<TopHoldingEntity[]>, GetTopHoldingsUseCaseParams>
{
  constructor(
    private readonly topHoldingRepository: TopHoldingRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetTopHoldingsUseCaseParams): Promise<DataState<TopHoldingEntity[]>> {
    try {
      const session = await this.retrieveSession();
      return this.topHoldingRepository.getTopHoldings(
        { currency: params.currency, displayCurrency: params.displayCurrency, limit: params.limit },
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
