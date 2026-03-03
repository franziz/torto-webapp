import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import {
  AccountRepository,
  CreateAccountParams,
  ListAccountsFilter,
  UpdateAccountParams,
} from "@/features/account/domain/repositories/account";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountService } from "@/features/account/domain/sources/account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly accountService: AccountService) {}

  public async list(
    filter: ListAccountsFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<AccountEntity>>> {
    try {
      const result = await this.accountService.list({ page: filter.page, limit: filter.limit }, session);
      return new DataSuccess({
        data: result.data.map((model) => model.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateAccountParams, session: SessionEntity): Promise<DataState<AccountEntity>> {
    try {
      const result = await this.accountService.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(
    id: string,
    params: UpdateAccountParams,
    session: SessionEntity,
  ): Promise<DataState<AccountEntity>> {
    try {
      const result = await this.accountService.update(id, params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.accountService.delete(id, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
