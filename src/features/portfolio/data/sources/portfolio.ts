import { PortfolioService } from "@/features/portfolio/domain/sources/portfolio";
import { PortfolioSummaryModel } from "@/features/portfolio/data/models/portfolio-summary";
import { PortfolioByAccountModel } from "@/features/portfolio/data/models/portfolio-by-account";
import { PortfolioByAssetTypeModel } from "@/features/portfolio/data/models/portfolio-by-asset-type";
import { PortfolioByCountryModel } from "@/features/portfolio/data/models/portfolio-by-country";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

function extractArray(result: any): Record<string, any>[] {
  if (Array.isArray(result)) return result;
  if (result && Array.isArray(result.data)) return result.data;
  if (result && typeof result === "object" && Object.keys(result).length > 0) return [result];
  return [];
}

export class PortfolioServiceImpl implements PortfolioService {
  constructor(private readonly http: HttpRequest) {}

  public async getSummary(session: SessionEntity): Promise<PortfolioSummaryModel[]> {
    try {
      const result = await this.http.request(
        {
          path: "/api/portfolio/summary",
          method: "GET",
          session,
        },
        { requireAccount: false },
      );
      return extractArray(result).map((item) => PortfolioSummaryModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getByAccount(session: SessionEntity): Promise<PortfolioByAccountModel[]> {
    try {
      const result = await this.http.request(
        {
          path: "/api/portfolio/by-account",
          method: "GET",
          session,
        },
        { requireAccount: false },
      );
      return extractArray(result).map((item) => PortfolioByAccountModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getByAssetType(session: SessionEntity): Promise<PortfolioByAssetTypeModel[]> {
    try {
      const result = await this.http.request(
        {
          path: "/api/portfolio/by-asset-type",
          method: "GET",
          session,
        },
        { requireAccount: false },
      );
      return extractArray(result).map((item) => PortfolioByAssetTypeModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getByCountry(session: SessionEntity): Promise<PortfolioByCountryModel[]> {
    try {
      const result = await this.http.request(
        {
          path: "/api/portfolio/by-country",
          method: "GET",
          session,
        },
        { requireAccount: false },
      );
      return extractArray(result).map((item) => PortfolioByCountryModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
