import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { AssetRepository, ListAssetsFilter, CreateAssetParams, UpdateAssetParams } from "@/features/asset/domain/repositories/asset";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AssetService } from "@/features/asset/domain/sources/asset";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AssetRepositoryImpl implements AssetRepository {
  constructor(private readonly assetService: AssetService) {}

  public async list(filter: ListAssetsFilter, session: SessionEntity): Promise<DataState<PaginatedData<AssetEntity>>> {
    try {
      const result = await this.assetService.list(
        { page: filter.page, limit: filter.limit, accountId: filter.accountId, assetTypeId: filter.assetTypeId },
        session,
      );
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateAssetParams, session: SessionEntity): Promise<DataState<AssetEntity>> {
    try {
      const result = await this.assetService.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(id: string, params: UpdateAssetParams, session: SessionEntity): Promise<DataState<AssetEntity>> {
    try {
      const result = await this.assetService.update(id, params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.assetService.delete(id, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
