import { AbstractEntity } from "@/core/resources/entity";

interface PortfolioByAssetTypeEntityConstructor {
  assetTypeId: string;
  assetTypeCode: string;
  assetTypeName: string;
  currency: string;
  totalCost: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
}

export class PortfolioByAssetTypeEntity implements AbstractEntity {
  public assetTypeId: string;
  public assetTypeCode: string;
  public assetTypeName: string;
  public currency: string;
  public totalCost: number;
  public currentValue: number;
  public unrealizedGain: number;
  public realizedGain: number;

  constructor(args: PortfolioByAssetTypeEntityConstructor) {
    this.assetTypeId = args.assetTypeId;
    this.assetTypeCode = args.assetTypeCode;
    this.assetTypeName = args.assetTypeName;
    this.currency = args.currency;
    this.totalCost = args.totalCost;
    this.currentValue = args.currentValue;
    this.unrealizedGain = args.unrealizedGain;
    this.realizedGain = args.realizedGain;
  }
}
