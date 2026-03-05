import { AbstractModel } from "@/core/resources/model";
import { PositionEntity } from "@/features/position/domain/entities/position";

interface PositionModelConstructor {
  id: string;
  assetId: string;
  totalUnits: number;
  totalCost: number;
  averageCostPerUnit: number;
  realizedGain: number;
  totalDividends: number;
  totalInterest: number;

  manualCurrentPrice?: number;
  isMarketPriced?: boolean;
  marketPrice?: number;
  effectivePrice?: number;
  currentValue: number;
  unrealizedGain: number;
  totalReturn: number;
  currency: string;
  assetName?: string;
  assetTicker?: string;
  assetTypeCode?: string;
  assetTypeName?: string;
  accountName?: string;
  accountCountry?: string;
}

export class PositionModel implements AbstractModel {
  public id: string;
  public assetId: string;
  public totalUnits: number;
  public totalCost: number;
  public averageCostPerUnit: number;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;

  public manualCurrentPrice?: number;
  public isMarketPriced?: boolean;
  public marketPrice?: number;
  public effectivePrice?: number;
  public currentValue: number;
  public unrealizedGain: number;
  public totalReturn: number;
  public currency: string;
  public assetName?: string;
  public assetTicker?: string;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public accountName?: string;
  public accountCountry?: string;

  constructor(args: PositionModelConstructor) {
    this.id = args.id;
    this.assetId = args.assetId;
    this.totalUnits = args.totalUnits;
    this.totalCost = args.totalCost;
    this.averageCostPerUnit = args.averageCostPerUnit;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;

    this.manualCurrentPrice = args.manualCurrentPrice;
    this.isMarketPriced = args.isMarketPriced;
    this.marketPrice = args.marketPrice;
    this.effectivePrice = args.effectivePrice;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.totalReturn = args.totalReturn;
    this.currency = args.currency;
    this.assetName = args.assetName;
    this.assetTicker = args.assetTicker;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
  }

  public static fromJson(doc: Record<string, any>): PositionModel {
    return new PositionModel({
      id: doc["id"],
      assetId: doc["asset_id"],
      totalUnits: Number(doc["total_units"]),
      totalCost: Number(doc["total_cost"]),
      averageCostPerUnit: Number(doc["average_cost_per_unit"]),
      realizedGain: Number(doc["realized_gain"]),
      totalDividends: Number(doc["total_dividends"]),
      totalInterest: Number(doc["total_interest"]),

      manualCurrentPrice: doc["manual_current_price"] != null ? Number(doc["manual_current_price"]) : undefined,
      isMarketPriced: doc["is_market_priced"] ?? undefined,
      marketPrice: doc["market_price"] != null ? Number(doc["market_price"]) : undefined,
      effectivePrice: doc["effective_price"] != null ? Number(doc["effective_price"]) : undefined,
      currentValue: Number(doc["current_value"]),
      unrealizedGain: Number(doc["unrealized_gain"]),
      totalReturn: Number(doc["total_return"]),
      currency: doc["currency"],
      assetName: doc["asset_name"],
      assetTicker: doc["asset_ticker"],
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      accountName: doc["account_name"],
      accountCountry: doc["account_country"],
    });
  }

  public toEntity(): PositionEntity {
    return new PositionEntity({
      id: this.id,
      assetId: this.assetId,
      totalUnits: this.totalUnits,
      totalCost: this.totalCost,
      averageCostPerUnit: this.averageCostPerUnit,
      realizedGain: this.realizedGain,
      totalDividends: this.totalDividends,
      totalInterest: this.totalInterest,

      manualCurrentPrice: this.manualCurrentPrice,
      isMarketPriced: this.isMarketPriced,
      marketPrice: this.marketPrice,
      effectivePrice: this.effectivePrice,
      currentValue: this.currentValue,
      unrealizedGain: this.unrealizedGain,
      totalReturn: this.totalReturn,
      currency: this.currency,
      assetName: this.assetName,
      assetTicker: this.assetTicker,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      accountName: this.accountName,
      accountCountry: this.accountCountry,
    });
  }
}
