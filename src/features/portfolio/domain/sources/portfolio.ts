import { PortfolioSummaryModel } from "@/features/portfolio/data/models/portfolio-summary";
import { PortfolioByAccountModel } from "@/features/portfolio/data/models/portfolio-by-account";
import { PortfolioByAssetTypeModel } from "@/features/portfolio/data/models/portfolio-by-asset-type";
import { PortfolioByCountryModel } from "@/features/portfolio/data/models/portfolio-by-country";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface PortfolioService {
  getSummary(session: SessionEntity): Promise<PortfolioSummaryModel[]>;
  getByAccount(session: SessionEntity): Promise<PortfolioByAccountModel[]>;
  getByAssetType(session: SessionEntity): Promise<PortfolioByAssetTypeModel[]>;
  getByCountry(session: SessionEntity): Promise<PortfolioByCountryModel[]>;
}
