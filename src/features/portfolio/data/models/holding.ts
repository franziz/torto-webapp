import { AbstractModel } from "@/core/resources/model";
import { HoldingEntity } from "@/features/portfolio/domain/entities/holding";

interface HoldingModelConstructor {
  id: string;
  assetId: string;
  assetName?: string;
  assetTicker?: string;
  assetExchange?: string;
  assetTypeCode?: string;
  assetTypeName?: string;
  accountName?: string;
  accountCountry?: string;
  currency: string;
  totalUnits: number;
  totalCost: number;
  averageCostPerUnit: number;
  realizedGain: number;
  totalDividends: number;
  totalInterest: number;
  unrealizedGain?: number;
  totalIncome?: number;
  capitalReturn?: number;
  totalReturn?: number;
  manualCurrentPrice?: number;
  manualPriceUpdatedAt?: string;
  marketPrice?: number;
  marketPriceUpdatedAt?: string;
  effectivePrice?: number;
  currentValue: number;
  createdAt?: string;
  updatedAt?: string;
  convertedValue?: number;
  convertedTotalCost?: number;
}

export class HoldingModel implements AbstractModel {
  public id: string;
  public assetId: string;
  public assetName?: string;
  public assetTicker?: string;
  public assetExchange?: string;
  public assetTypeCode?: string;
  public assetTypeName?: string;
  public accountName?: string;
  public accountCountry?: string;
  public currency: string;
  public totalUnits: number;
  public totalCost: number;
  public averageCostPerUnit: number;
  public realizedGain: number;
  public totalDividends: number;
  public totalInterest: number;
  public unrealizedGain?: number;
  public totalIncome?: number;
  public capitalReturn?: number;
  public totalReturn?: number;
  public manualCurrentPrice?: number;
  public manualPriceUpdatedAt?: string;
  public marketPrice?: number;
  public marketPriceUpdatedAt?: string;
  public effectivePrice?: number;
  public currentValue: number;
  public createdAt?: string;
  public updatedAt?: string;
  public convertedValue?: number;
  public convertedTotalCost?: number;

  constructor(args: HoldingModelConstructor) {
    this.id = args.id;
    this.assetId = args.assetId;
    this.assetName = args.assetName;
    this.assetTicker = args.assetTicker;
    this.assetExchange = args.assetExchange;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
    this.currency = args.currency;
    this.totalUnits = args.totalUnits;
    this.totalCost = args.totalCost;
    this.averageCostPerUnit = args.averageCostPerUnit;
    this.realizedGain = args.realizedGain;
    this.totalDividends = args.totalDividends;
    this.totalInterest = args.totalInterest;
    this.unrealizedGain = args.unrealizedGain;
    this.totalIncome = args.totalIncome;
    this.capitalReturn = args.capitalReturn;
    this.totalReturn = args.totalReturn;
    this.manualCurrentPrice = args.manualCurrentPrice;
    this.manualPriceUpdatedAt = args.manualPriceUpdatedAt;
    this.marketPrice = args.marketPrice;
    this.marketPriceUpdatedAt = args.marketPriceUpdatedAt;
    this.effectivePrice = args.effectivePrice;
    this.currentValue = args.currentValue;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.convertedValue = args.convertedValue;
    this.convertedTotalCost = args.convertedTotalCost;
  }

  public static fromJson(doc: Record<string, any>): HoldingModel {
    return new HoldingModel({
      id: doc["id"],
      assetId: doc["asset_id"],
      assetName: doc["asset_name"],
      assetTicker: doc["asset_ticker"],
      assetExchange: doc["asset_exchange"],
      assetTypeCode: doc["asset_type_code"],
      assetTypeName: doc["asset_type_name"],
      accountName: doc["account_name"],
      accountCountry: doc["account_country"],
      currency: doc["currency"],
      totalUnits: Number(doc["total_units"]),
      totalCost: Number(doc["total_cost"]),
      averageCostPerUnit: Number(doc["average_cost_per_unit"]),
      realizedGain: Number(doc["realized_gain"]),
      totalDividends: Number(doc["total_dividends"]),
      totalInterest: Number(doc["total_interest"]),
      unrealizedGain: doc["unrealized_gain"] != null ? Number(doc["unrealized_gain"]) : undefined,
      totalIncome: doc["total_income"] != null ? Number(doc["total_income"]) : undefined,
      capitalReturn: doc["capital_return"] != null ? Number(doc["capital_return"]) : undefined,
      totalReturn: doc["total_return"] != null ? Number(doc["total_return"]) : undefined,
      manualCurrentPrice: doc["manual_current_price"] != null ? Number(doc["manual_current_price"]) : undefined,
      manualPriceUpdatedAt: doc["manual_price_updated_at"],
      marketPrice: doc["market_price"] != null ? Number(doc["market_price"]) : undefined,
      marketPriceUpdatedAt: doc["market_price_updated_at"],
      effectivePrice: doc["effective_price"] != null ? Number(doc["effective_price"]) : undefined,
      currentValue: Number(doc["current_value"]),
      createdAt: doc["created_at"],
      updatedAt: doc["updated_at"],
      convertedValue: doc["converted_value"] != null ? Number(doc["converted_value"]) : undefined,
      convertedTotalCost: doc["converted_total_cost"] != null ? Number(doc["converted_total_cost"]) : undefined,
    });
  }

  public toEntity(): HoldingEntity {
    return new HoldingEntity({
      id: this.id,
      assetId: this.assetId,
      assetName: this.assetName,
      assetTicker: this.assetTicker,
      assetExchange: this.assetExchange,
      assetTypeCode: this.assetTypeCode,
      assetTypeName: this.assetTypeName,
      accountName: this.accountName,
      accountCountry: this.accountCountry,
      currency: this.currency,
      totalUnits: this.totalUnits,
      totalCost: this.totalCost,
      averageCostPerUnit: this.averageCostPerUnit,
      realizedGain: this.realizedGain,
      totalDividends: this.totalDividends,
      totalInterest: this.totalInterest,
      unrealizedGain: this.unrealizedGain,
      totalIncome: this.totalIncome,
      capitalReturn: this.capitalReturn,
      totalReturn: this.totalReturn,
      manualCurrentPrice: this.manualCurrentPrice,
      manualPriceUpdatedAt: this.manualPriceUpdatedAt,
      marketPrice: this.marketPrice,
      marketPriceUpdatedAt: this.marketPriceUpdatedAt,
      effectivePrice: this.effectivePrice,
      currentValue: this.currentValue,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      convertedValue: this.convertedValue,
      convertedTotalCost: this.convertedTotalCost,
    });
  }
}
