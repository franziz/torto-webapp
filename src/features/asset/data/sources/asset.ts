import {
  AssetService,
  ListAssetsServiceFilter,
  CreateAssetServiceParams,
} from "@/features/asset/domain/sources/asset";
import { AssetModel } from "@/features/asset/data/models/asset";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AssetServiceImpl implements AssetService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListAssetsServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AssetModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);
      if (filter.accountId) searchParams.account_id = filter.accountId;
      if (filter.assetTypeId) searchParams.asset_type_id = filter.assetTypeId;

      const result = await this.http.request(
        {
          path: "/api/assets",
          method: "GET",
          searchParams,
          session,
        },
        { requireAccount: false },
      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => AssetModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateAssetServiceParams, session: SessionEntity): Promise<AssetModel> {
    try {
      const result = await this.http.request(
        {
          path: "/api/assets",
          method: "POST",
          body: {
            account_id: params.accountId,
            asset_type_id: params.assetTypeId,
            name: params.name,
            ticker: params.ticker,
            description: params.description,
          },
          session,
        },
        { requireAccount: false },
      );

      return AssetModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request(
        {
          path: `/api/assets/${id}`,
          method: "DELETE",
          session,
        },
        { requireAccount: false },
      );
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
