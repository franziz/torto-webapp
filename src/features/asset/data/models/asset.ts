import { AbstractModel } from "@/core/resources/model";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { DateTime } from "luxon";

interface AssetModelConstructor {
  id: string;
  accountId: string;
  assetTypeId: string;
  name: string;
  ticker?: string;
  description?: string;
  assetTypeCode?: string;
  assetTypeName?: string;
  accountName?: string;
  accountCountry?: string;
  accountCurrency?: string;
  createdAt: string;
  updatedAt: string;
}

export class AssetModel implements AbstractModel {
  public id: string;
  public accountId: string;
  public assetTypeId: string;
  public name: string;
  public ticker?: string;
  public description?: string;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public accountName?: string;
  public accountCountry?: string;
  public accountCurrency?: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: AssetModelConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.assetTypeId = args.assetTypeId;
    this.name = args.name;
    this.ticker = args.ticker;
    this.description = args.description;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
    this.accountCurrency = args.accountCurrency;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(doc: Record<string, any>): AssetModel {
    return new AssetModel({
      id: doc["id"],
      accountId: doc["account_id"],
      assetTypeId: doc["asset_type_id"],
      name: doc["name"],
      ticker: doc["ticker"],
      description: doc["description"],
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      accountName: doc["account_name"],
      accountCountry: doc["account_country"],
      accountCurrency: doc["account_currency"],
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
    });
  }

  public toEntity(): AssetEntity {
    return new AssetEntity({
      id: this.id,
      accountId: this.accountId,
      assetTypeId: this.assetTypeId,
      name: this.name,
      ticker: this.ticker,
      description: this.description,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      accountName: this.accountName,
      accountCountry: this.accountCountry,
      accountCurrency: this.accountCurrency,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
