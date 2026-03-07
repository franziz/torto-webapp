import { TopHoldingService, GetTopHoldingsServiceFilter } from "@/features/portfolio/domain/sources/top-holding";
import { TopHoldingModel } from "@/features/portfolio/data/models/top-holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

function extractArray(result: any): Record<string, any>[] {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && Object.keys(result).length > 0) return [result];
  return [];
}

export class TopHoldingServiceImpl implements TopHoldingService {
  constructor(private readonly http: HttpRequest) {}

  public async getTopHoldings(
    filter: GetTopHoldingsServiceFilter,
    session: SessionEntity,
  ): Promise<TopHoldingModel[]> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.currency) searchParams.currency = filter.currency;
      if (filter.displayCurrency) searchParams.display_currency = filter.displayCurrency;
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request({
        path: "/api/positions/top-holdings",
        method: "GET",
        searchParams,
        session,
      });

      return extractArray(result).map((item) => TopHoldingModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
