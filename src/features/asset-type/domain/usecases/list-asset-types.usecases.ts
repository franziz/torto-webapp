import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { AssetTypeRepository } from "@/features/asset-type/domain/repositories/asset-type";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListAssetTypesUseCaseParams {
  public page?: number;
  public limit?: number;

  constructor(args: { page?: number; limit?: number }) {
    this.page = args.page;
    this.limit = args.limit;
  }
}

export class ListAssetTypesUseCase
  implements UseCase<DataState<PaginatedData<AssetTypeEntity>>, ListAssetTypesUseCaseParams>
{
  constructor(
    private readonly assetTypeRepository: AssetTypeRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListAssetTypesUseCaseParams): Promise<DataState<PaginatedData<AssetTypeEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.assetTypeRepository.list({ page: params.page, limit: params.limit }, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
