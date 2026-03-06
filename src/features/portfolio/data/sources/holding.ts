import { HoldingService, GetHoldingsServiceFilter, HoldingsServiceResult } from "@/features/portfolio/domain/sources/holding";
import { HoldingModel } from "@/features/portfolio/data/models/holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

function extractArray(result: any): Record<string, any>[] {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && Object.keys(result).length > 0) return [result];
  return [];
}

export class HoldingServiceImpl implements HoldingService {
  constructor(private readonly http: HttpRequest) {}

  public async getHoldings(
    filter: GetHoldingsServiceFilter,
    session: SessionEntity,
  ): Promise<HoldingsServiceResult> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);
      if (filter.currency) searchParams.currency = filter.currency;
      if (filter.displayCurrency) searchParams.display_currency = filter.displayCurrency;
      if (filter.sortBy) searchParams.sort_by = filter.sortBy;
      if (filter.sortOrder) searchParams.sort_order = filter.sortOrder;
      if (filter.search) searchParams.search = filter.search;

      const result = await this.http.request({
        path: "/api/portfolio/holdings",
        method: "GET",
        searchParams,
        session,
      });

      const items = extractArray(result).map((item) => HoldingModel.fromJson(item));

      const meta = result?.meta ?? { page: 1, limit: filter.limit ?? 20, total: items.length, totalPages: 1 };

      return {
        data: items,
        meta: {
          page: Number(meta.page),
          limit: Number(meta.limit),
          total: Number(meta.total),
          totalPages: Number(meta.total_pages ?? meta.totalPages ?? 1),
        },
        exchangeRatesUsed: result?.exchange_rates_used,
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
