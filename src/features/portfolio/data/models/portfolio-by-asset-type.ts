import { AbstractModel } from "@/core/resources/model";
import { PortfolioByAssetTypeEntity } from "@/features/portfolio/domain/entities/portfolio-by-asset-type";

export class PortfolioByAssetTypeModel implements AbstractModel {
  public assetTypeId: string;
  public assetTypeCode: string;
  public assetTypeName: string;
  public currency: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: {
    assetTypeId: string;
    assetTypeCode: string;
    assetTypeName: string;
    currency: string;
    totalCost: number;
    currentValue: number;
    unrealizedGain: number;
    realizedGain: number;
  }) {
    this.assetTypeId = args.assetTypeId;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }

  public static fromJson(doc: Record<string, any>): PortfolioByAssetTypeModel {
    return new PortfolioByAssetTypeModel({
      assetTypeId: doc["asset_type_id"],
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      currency: doc["currency"],
      totalCost: Number(doc["total_cost"]),
      currentValue: Number(doc["current_value"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      realizedGain: Number(doc["realized_gain"]),
    });
  }

  public toEntity(): PortfolioByAssetTypeEntity {
    return new PortfolioByAssetTypeEntity({
      assetTypeId: this.assetTypeId,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      currency: this.currency,
      totalCost: this.totalCost,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      realizedGain: this.realizedGain,
    });
  }
}
