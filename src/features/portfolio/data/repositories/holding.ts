import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { HoldingRepository, GetHoldingsFilter, HoldingsResult } from "@/features/portfolio/domain/repositories/holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HoldingService } from "@/features/portfolio/domain/sources/holding";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class HoldingRepositoryImpl implements HoldingRepository {
  constructor(private readonly holdingService: HoldingService) {}

  public async getHoldings(
    filter: GetHoldingsFilter,
    session: SessionEntity,
  ): Promise<DataState<HoldingsResult>> {
    try {
      const result = await this.holdingService.getHoldings(
        {
          page: filter.page,
          limit: filter.limit,
          currency: filter.currency,
          displayCurrency: filter.displayCurrency,
          sortBy: filter.sortBy,
          sortOrder: filter.sortOrder,
          search: filter.search,
        },
        session,
      );
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta,
        exchangeRatesUsed: result.exchangeRatesUsed,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
