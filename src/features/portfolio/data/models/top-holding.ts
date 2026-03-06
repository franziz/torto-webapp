import { AbstractModel } from "@/core/resources/model";
import { TopHoldingEntity } from "@/features/portfolio/domain/entities/top-holding";

interface TopHoldingModelConstructor {
  id: string;
  assetName: string;
  assetTicker?: string;
  assetTypeCode?: string;
  assetTypeName?: string;
  accountName?: string;
  currency: string;
  currentValue: number;
  totalUnits: number;
  totalCost: number;
  unrealizedGain: number;
  totalReturn: number;
  convertedValue?: number;
}

export class TopHoldingModel implements AbstractModel {
  public id: string;
  public assetName: string;
  public assetTicker?: string;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public accountName?: string;
  public currency: string;
  public currentValue: number;
  public totalUnits: number;
  public totalCost: number;
  public unrealizedGain: number;
  public totalReturn: number;
  public convertedValue?: number;

  constructor(args: TopHoldingModelConstructor) {
    this.id = args.id;
    this.assetName = args.assetName;
    this.assetTicker = args.assetTicker;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.accountName = args.accountName;
    this.currency = args.currency;
    this.currentValue = args.currentValue;
    this.totalUnits = args.totalUnits;
    this.totalCost = args.totalCost;
    this.unrealizedGain = args.unrealizedGain;
    this.totalReturn = args.totalReturn;
    this.convertedValue = args.convertedValue;
  }

  public static fromJson(doc: Record<string, any>): TopHoldingModel {
    return new TopHoldingModel({
      id: doc["id"],
      assetName: doc["asset_name"],
      assetTicker: doc["asset_ticker"],
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      accountName: doc["account_name"],
      currency: doc["currency"],
      currentValue: Number(doc["current_value"]),
      totalUnits: Number(doc["total_units"]),
      totalCost: Number(doc["total_cost"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      totalReturn: Number(doc["total_return"]),
      convertedValue: doc["converted_value"] != null ? Number(doc["converted_value"]) : undefined,
    });
  }

  public toEntity(): TopHoldingEntity {
    return new TopHoldingEntity({
      id: this.id,
      assetName: this.assetName,
      assetTicker: this.assetTicker,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      accountName: this.accountName,
      currency: this.currency,
      currentValue: this.currentValue,
      totalUnits: this.totalUnits,
      totalCost: this.totalCost,
      unrealizedGain: this.unrealizedGain,
      totalReturn: this.totalReturn,
      convertedValue: this.convertedValue,
    });
  }
}
