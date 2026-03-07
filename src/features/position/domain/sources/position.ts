import { PositionModel } from "@/features/position/data/models/position";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListPositionsServiceFilter {
  page?: number;
  limit?: number;
  currency?: string;
}

export interface PositionService {
  list(
    filter: ListPositionsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: PositionModel[]; meta: PaginationMetaModel }>;
  updateCurrentPrice(assetId: string, price: number, session: SessionEntity): Promise<PositionModel>;
}
