import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { HoldingRepository, HoldingsResult } from "@/features/portfolio/domain/repositories/holding";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetHoldingsUseCaseParams {
  public page?: number;
  public limit?: number;
  public currency?: string;
  public displayCurrency?: string;
  public sortBy?: string;
  public sortOrder?: string;
  public search?: string;

  constructor(args: {
    page?: number;
    limit?: number;
    currency?: string;
    displayCurrency?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }) {
    this.page = args.page;
    this.limit = args.limit;
    this.currency = args.currency;
    this.displayCurrency = args.displayCurrency;
    this.sortBy = args.sortBy;
    this.sortOrder = args.sortOrder;
    this.search = args.search;
  }
}

export class GetHoldingsUseCase implements UseCase<DataState<HoldingsResult>, GetHoldingsUseCaseParams> {
  constructor(
    private readonly holdingRepository: HoldingRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetHoldingsUseCaseParams): Promise<DataState<HoldingsResult>> {
    try {
      const session = await this.retrieveSession();
      return this.holdingRepository.getHoldings(
        {
          page: params.page,
          limit: params.limit,
          currency: params.currency,
          displayCurrency: params.displayCurrency,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          search: params.search,
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
