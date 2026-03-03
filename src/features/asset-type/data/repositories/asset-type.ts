import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { AssetTypeRepository, ListAssetTypesFilter } from "@/features/asset-type/domain/repositories/asset-type";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AssetTypeService } from "@/features/asset-type/domain/sources/asset-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AssetTypeRepositoryImpl implements AssetTypeRepository {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  public async list(
    filter: ListAssetTypesFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<AssetTypeEntity>>> {
    try {
      const result = await this.assetTypeService.list({ page: filter.page, limit: filter.limit }, session);
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
