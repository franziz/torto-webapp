import { AccountModel } from "@/features/account/data/models/account";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface ListAccountsServiceFilter {
  page?: number;
  limit?: number;
}

export interface CreateAccountServiceParams {
  name: string;
  country: string;
  currency: string;
  description?: string;
}

export interface UpdateAccountServiceParams {
  name: string;
  country: string;
  currency: string;
  description?: string;
}

export interface AccountService {
  list(
    filter: ListAccountsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AccountModel[]; meta: PaginationMetaModel }>;
  create(params: CreateAccountServiceParams, session: SessionEntity): Promise<AccountModel>;
  update(id: string, params: UpdateAccountServiceParams, session: SessionEntity): Promise<AccountModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
