import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PortfolioRepository } from "@/features/portfolio/domain/repositories/portfolio";
import { PortfolioSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-summary";
import { PortfolioByAccountEntity } from "@/features/portfolio/domain/entities/portfolio-by-account";
import { PortfolioByAssetTypeEntity } from "@/features/portfolio/domain/entities/portfolio-by-asset-type";
import { PortfolioByCountryEntity } from "@/features/portfolio/domain/entities/portfolio-by-country";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PortfolioService } from "@/features/portfolio/domain/sources/portfolio";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class PortfolioRepositoryImpl implements PortfolioRepository {
  constructor(private readonly portfolioService: PortfolioService) {}

  public async getSummary(session: SessionEntity): Promise<DataState<PortfolioSummaryEntity[]>> {
    try {
      const result = await this.portfolioService.getSummary(session);
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getByAccount(session: SessionEntity): Promise<DataState<PortfolioByAccountEntity[]>> {
    try {
      const result = await this.portfolioService.getByAccount(session);
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getByAssetType(session: SessionEntity): Promise<DataState<PortfolioByAssetTypeEntity[]>> {
    try {
      const result = await this.portfolioService.getByAssetType(session);
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getByCountry(session: SessionEntity): Promise<DataState<PortfolioByCountryEntity[]>> {
    try {
      const result = await this.portfolioService.getByCountry(session);
      return new DataSuccess(result.map((model) => model.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
