import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { TopHoldingRepository, GetTopHoldingsFilter } from "@/features/portfolio/domain/repositories/top-holding";
import { TopHoldingEntity } from "@/features/portfolio/domain/entities/top-holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { TopHoldingService } from "@/features/portfolio/domain/sources/top-holding";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class TopHoldingRepositoryImpl implements TopHoldingRepository {
  constructor(private readonly topHoldingService: TopHoldingService) {}

  public async getTopHoldings(
    filter: GetTopHoldingsFilter,
    session: SessionEntity,
  ): Promise<DataState<TopHoldingEntity[]>> {
    try {
      const result = await this.topHoldingService.getTopHoldings(
        { currency: filter.currency, displayCurrency: filter.displayCurrency, limit: filter.limit },
        session,
      );
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
