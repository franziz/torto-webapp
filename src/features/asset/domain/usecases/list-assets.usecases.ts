import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { AssetRepository } from "@/features/asset/domain/repositories/asset";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListAssetsUseCaseParams {
  public page?: number;
  public limit?: number;
  public accountId?: string;
  public assetTypeId?: string;

  constructor(args: { page?: number; limit?: number; accountId?: string; assetTypeId?: string }) {
    this.page = args.page;
    this.limit = args.limit;
    this.accountId = args.accountId;
    this.assetTypeId = args.assetTypeId;
  }
}

export class ListAssetsUseCase implements UseCase<DataState<PaginatedData<AssetEntity>>, ListAssetsUseCaseParams> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: ListAssetsUseCaseParams): Promise<DataState<PaginatedData<AssetEntity>>> {
    try {
      const session = await this.retrieveSession();
      return this.assetRepository.list(
        { page: params.page, limit: params.limit, accountId: params.accountId, assetTypeId: params.assetTypeId },
        session,
      );
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
