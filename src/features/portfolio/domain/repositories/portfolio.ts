import { DataState } from "@/core/resources/data-state";
import { PortfolioSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-summary";
import { PortfolioByAccountEntity } from "@/features/portfolio/domain/entities/portfolio-by-account";
import { PortfolioByAssetTypeEntity } from "@/features/portfolio/domain/entities/portfolio-by-asset-type";
import { PortfolioByCountryEntity } from "@/features/portfolio/domain/entities/portfolio-by-country";
import { PortfolioConvertedSummaryEntity } from "@/features/portfolio/domain/entities/portfolio-converted-summary";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface PortfolioRepository {
  getSummary(session: SessionEntity): Promise<DataState<PortfolioSummaryEntity[]>>;
  getByAccount(session: SessionEntity): Promise<DataState<PortfolioByAccountEntity[]>>;
  getByAssetType(session: SessionEntity): Promise<DataState<PortfolioByAssetTypeEntity[]>>;
  getByCountry(session: SessionEntity): Promise<DataState<PortfolioByCountryEntity[]>>;
  getConvertedSummary(session: SessionEntity, currency: string): Promise<DataState<PortfolioConvertedSummaryEntity>>;
}
