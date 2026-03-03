import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AssetRepository } from "@/features/asset/domain/repositories/asset";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class DeleteAssetUseCaseParams {
  public id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
  }
}

export class DeleteAssetUseCase implements UseCase<DataState<void>, DeleteAssetUseCaseParams> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: DeleteAssetUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.retrieveSession();
      return this.assetRepository.delete(params.id, session);
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
