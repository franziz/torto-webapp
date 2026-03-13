import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface PositionEntityConstructor {
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
  assetTypeCategory?: string;
  assetMaturityDate?: DateTime;
  assetFaceValue?: number;
  accountName?: string;
  accountCountry?: string;
}

export class PositionEntity implements AbstractEntity {
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
  public assetTypeCategory?: string;
  public assetMaturityDate?: DateTime;
  public assetFaceValue?: number;
  public accountName?: string;
  public accountCountry?: string;

  constructor(args: PositionEntityConstructor) {
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
    this.assetTypeCategory = args.assetTypeCategory;
    this.assetMaturityDate = args.assetMaturityDate;
    this.assetFaceValue = args.assetFaceValue;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
  }
}
