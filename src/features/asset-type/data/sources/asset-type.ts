import { AssetTypeService, ListAssetTypesServiceFilter } from "@/features/asset-type/domain/sources/asset-type";
import { AssetTypeModel } from "@/features/asset-type/data/models/asset-type";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class AssetTypeServiceImpl implements AssetTypeService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListAssetTypesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: AssetTypeModel[]; meta: PaginationMetaModel }> {
    try {
      const searchParams: Record<string, string> = {};
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);

      const result = await this.http.request(
        {
          path: "/api/asset-types",
          method: "GET",
          searchParams,
          session,
        },

      );

      return {
        data: (result.data ?? []).map((item: Record<string, any>) => AssetTypeModel.fromJson(item)),
        meta: PaginationMetaModel.fromJson(result.meta ?? {}),
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
