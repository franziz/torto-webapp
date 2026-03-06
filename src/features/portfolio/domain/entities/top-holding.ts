import { AbstractEntity } from "@/core/resources/entity";

interface TopHoldingEntityConstructor {
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

export class TopHoldingEntity implements AbstractEntity {
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

  constructor(args: TopHoldingEntityConstructor) {
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
}
