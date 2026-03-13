import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { AssetRepository, UpdateAssetParams } from "@/features/asset/domain/repositories/asset";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class UpdateAssetUseCaseParams {
  public id: string;
  public name: string;
  public ticker?: string;
  public description?: string;
  public maturityDate?: string;
  public faceValue?: number;

  constructor(args: {
    id: string;
    name: string;
    ticker?: string;
    description?: string;
    maturityDate?: string;
    faceValue?: number;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.ticker = args.ticker;
    this.description = args.description;
    this.maturityDate = args.maturityDate;
    this.faceValue = args.faceValue;
  }
}

export class UpdateAssetUseCase implements UseCase<DataState<AssetEntity>, UpdateAssetUseCaseParams> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: UpdateAssetUseCaseParams): Promise<DataState<AssetEntity>> {
    try {
      const session = await this.retrieveSession();
      const updateParams: UpdateAssetParams = {
        name: params.name,
        ticker: params.ticker,
        description: params.description,
        maturityDate: params.maturityDate,
        faceValue: params.faceValue,
      };
      return this.assetRepository.update(params.id, updateParams, session);
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
