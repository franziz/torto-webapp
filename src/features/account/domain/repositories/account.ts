import { DataState } from "@/core/resources/data-state";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAccountsFilter {
  page?: number;
  limit?: number;
}

export interface CreateAccountParams {
  name: string;
  country: string;
  currency: string;
  description?: string;
}

export interface UpdateAccountParams {
  name: string;
  country: string;
  currency: string;
  description?: string;
}

export interface AccountRepository {
  list(filter: ListAccountsFilter, session: SessionEntity): Promise<DataState<PaginatedData<AccountEntity>>>;
  create(params: CreateAccountParams, session: SessionEntity): Promise<DataState<AccountEntity>>;
  update(id: string, params: UpdateAccountParams, session: SessionEntity): Promise<DataState<AccountEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
