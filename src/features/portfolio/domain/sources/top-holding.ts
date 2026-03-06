import { TopHoldingModel } from "@/features/portfolio/data/models/top-holding";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface GetTopHoldingsServiceFilter {
  currency?: string;
  displayCurrency?: string;
  limit?: number;
}

export interface TopHoldingService {
  getTopHoldings(filter: GetTopHoldingsServiceFilter, session: SessionEntity): Promise<TopHoldingModel[]>;
}
