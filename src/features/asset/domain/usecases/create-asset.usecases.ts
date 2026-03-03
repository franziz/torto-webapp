import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { AssetRepository, CreateAssetParams } from "@/features/asset/domain/repositories/asset";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class CreateAssetUseCaseParams {
  public accountId: string;
  public assetTypeId: string;
  public name: string;
  public ticker?: string;
  public description?: string;

  constructor(args: { accountId: string; assetTypeId: string; name: string; ticker?: string; description?: string }) {
    this.accountId = args.accountId;
    this.assetTypeId = args.assetTypeId;
    this.name = args.name;
    this.ticker = args.ticker;
    this.description = args.description;
  }
}

export class CreateAssetUseCase implements UseCase<DataState<AssetEntity>, CreateAssetUseCaseParams> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateAssetUseCaseParams): Promise<DataState<AssetEntity>> {
    try {
      const session = await this.retrieveSession();
      const createParams: CreateAssetParams = {
        accountId: params.accountId,
        assetTypeId: params.assetTypeId,
        name: params.name,
        ticker: params.ticker,
        description: params.description,
      };
      return this.assetRepository.create(createParams, session);
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
