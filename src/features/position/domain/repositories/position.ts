import { DataState } from "@/core/resources/data-state";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListPositionsFilter {
  page?: number;
  limit?: number;
}

export interface PositionRepository {
  list(filter: ListPositionsFilter, session: SessionEntity): Promise<DataState<PaginatedData<PositionEntity>>>;
  updateCurrentPrice(assetId: string, price: number, session: SessionEntity): Promise<DataState<PositionEntity>>;
}
