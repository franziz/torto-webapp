import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface AssetEntityConstructor {
  id: string;
  accountId: string;
  assetTypeId: string;
  name: string;
  ticker?: string;
  description?: string;
  maturityDate?: DateTime;
  faceValue?: number;
  assetTypeCode?: string;
  assetTypeName?: string;
  assetTypeCategory?: string;
  accountName?: string;
  accountCountry?: string;
  accountCurrency?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class AssetEntity implements AbstractEntity {
  public id: string;
  public accountId: string;
  public assetTypeId: string;
  public name: string;
  public ticker?: string;
  public description?: string;
  public maturityDate?: DateTime;
  public faceValue?: number;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public assetTypeCategory?: string;
  public accountName?: string;
  public accountCountry?: string;
  public accountCurrency?: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: AssetEntityConstructor) {
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
}
