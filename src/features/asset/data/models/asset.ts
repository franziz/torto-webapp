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
  maturityDate?: string;
  faceValue?: number;
  assetTypeCode?: string;
  assetTypeName?: string;
  assetTypeCategory?: string;
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
  public maturityDate?: string;
  public faceValue?: number;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public assetTypeCategory?: string;
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
    this.maturityDate = args.maturityDate;
    this.faceValue = args.faceValue;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.assetTypeCategory = args.assetTypeCategory;
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
      maturityDate: doc["maturity_date"] ?? undefined,
      faceValue: doc["face_value"] != null ? Number(doc["face_value"]) : undefined,
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      assetTypeCategory: doc["asset_type_category"],
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
      maturityDate: this.maturityDate ? DateTime.fromISO(this.maturityDate) : undefined,
      faceValue: this.faceValue,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      assetTypeCategory: this.assetTypeCategory,
      accountName: this.accountName,
      accountCountry: this.accountCountry,
      accountCurrency: this.accountCurrency,
      createdAt: DateTime.fromISO(this.createdAt),
      updatedAt: DateTime.fromISO(this.updatedAt),
    });
  }
}
