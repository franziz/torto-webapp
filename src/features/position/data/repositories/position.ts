import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PositionRepository, ListPositionsFilter } from "@/features/position/domain/repositories/position";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PositionService } from "@/features/position/domain/sources/position";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class PositionRepositoryImpl implements PositionRepository {
  constructor(private readonly positionService: PositionService) {}

  public async list(
    filter: ListPositionsFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<PositionEntity>>> {
    try {
      const result = await this.positionService.list({ page: filter.page, limit: filter.limit }, session);
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
