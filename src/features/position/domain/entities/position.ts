import { AbstractEntity } from "@/core/resources/entity";

interface PositionEntityConstructor {
  id: string;
  assetId: string;
  totalUnits: number;
  totalCost: number;
  averageCostPerUnit: number;
  realizedGain: number;
  totalDividends: number;
  totalInterest: number;
  totalFees: number;
  manualCurrentPrice?: number;
  currentValue: number;
  unrealizedGain: number;
  currency: string;
  assetName?: string;
  assetTicker?: string;
  assetTypeCode?: string;
  assetTypeName?: string;
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
  public totalFees: number;
  public manualCurrentPrice?: number;
  public currentValue: number;
  public unrealizedGain: number;
  public currency: string;
  public assetName?: string;
  public assetTicker?: string;
  public assetTypeCode?: string;
  public assetTypeName?: string;
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
    this.totalFees = args.totalFees;
    this.manualCurrentPrice = args.manualCurrentPrice;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.currency = args.currency;
    this.assetName = args.assetName;
    this.assetTicker = args.assetTicker;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.accountName = args.accountName;
    this.accountCountry = args.accountCountry;
  }
}
