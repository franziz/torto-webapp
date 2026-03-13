export type ActionType = "buy" | "sell" | "deposit" | "dividend" | "interest" | "redemption" | "other";

export interface ActionTypeOption {
  type: ActionType;
  label: string;
  description: string;
  transactionTypeCode: string;
}

export const ACTION_TYPE_OPTIONS: ActionTypeOption[] = [
  { type: "buy", label: "Buy Investment", description: "Purchase stocks, ETFs, or funds", transactionTypeCode: "buy" },
  { type: "sell", label: "Sell Investment", description: "Sell existing holdings", transactionTypeCode: "sell" },
  {
    type: "deposit",
    label: "Deposit Cash",
    description: "Record a cash deposit or savings",
    transactionTypeCode: "buy",
  },
  {
    type: "dividend",
    label: "Record Dividend",
    description: "Dividend payment received",
    transactionTypeCode: "dividend",
  },
  {
    type: "interest",
    label: "Record Interest",
    description: "Interest earned on cash or bonds",
    transactionTypeCode: "interest",
  },
  {
    type: "redemption",
    label: "Redeem",
    description: "Redeem matured fixed-income at face value",
    transactionTypeCode: "redemption",
  },
  { type: "other", label: "Other", description: "Advanced form with all fields", transactionTypeCode: "" },
];

export interface FormFieldConfig {
  showUnits: boolean;
  showPricePerUnit: boolean;
  unitsLabel: string;
  priceLabel: string;
}

export const DEFAULT_FORM_CONFIG: FormFieldConfig = {
  showUnits: true,
  showPricePerUnit: true,
  unitsLabel: "Units",
  priceLabel: "Price per Unit",
};

export const ASSET_TYPE_FORM_CONFIG: Record<string, FormFieldConfig> = {
  stock: { showUnits: true, showPricePerUnit: true, unitsLabel: "Shares", priceLabel: "Price per Share" },
  etf: { showUnits: true, showPricePerUnit: true, unitsLabel: "Shares", priceLabel: "Price per Share" },
  crypto: { showUnits: true, showPricePerUnit: true, unitsLabel: "Units", priceLabel: "Price per Unit" },
  mutual_fund: { showUnits: true, showPricePerUnit: true, unitsLabel: "Units", priceLabel: "NAV per Unit" },
  cash: { showUnits: false, showPricePerUnit: false, unitsLabel: "Units", priceLabel: "Amount" },
  time_deposit: { showUnits: false, showPricePerUnit: false, unitsLabel: "Units", priceLabel: "Amount" },
  savings: { showUnits: false, showPricePerUnit: false, unitsLabel: "Units", priceLabel: "Amount" },
  bond: { showUnits: true, showPricePerUnit: true, unitsLabel: "Face Value", priceLabel: "Price per Unit" },
};

export function getFormConfig(assetTypeCode?: string): FormFieldConfig {
  if (!assetTypeCode) return DEFAULT_FORM_CONFIG;
  return ASSET_TYPE_FORM_CONFIG[assetTypeCode] ?? DEFAULT_FORM_CONFIG;
}

export type PositionActionType = Exclude<ActionType, "other">;

export interface PositionActionConfig {
  type: PositionActionType;
  label: string;
}

export const ASSET_TYPE_ACTIONS: Record<string, PositionActionConfig[]> = {
  stock: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "dividend", label: "Record Dividend" },
  ],
  etf: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "dividend", label: "Record Dividend" },
  ],
  mutual_fund: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "dividend", label: "Record Dividend" },
  ],
  crypto: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
  ],
  bond: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "interest", label: "Record Interest" },
    { type: "redemption", label: "Redeem" },
  ],
  cash: [
    { type: "deposit", label: "Deposit" },
    { type: "sell", label: "Withdraw" },
    { type: "interest", label: "Record Interest" },
  ],
  savings: [
    { type: "deposit", label: "Deposit" },
    { type: "sell", label: "Withdraw" },
    { type: "interest", label: "Record Interest" },
  ],
  time_deposit: [
    { type: "interest", label: "Record Interest" },
    { type: "redemption", label: "Redeem" },
  ],
};

export function getActionsForAssetType(
  assetTypeCode?: string,
  redeemable?: { hasMaturityDate: boolean; hasFaceValue: boolean },
): PositionActionConfig[] {
  if (!assetTypeCode) return [];
  const actions = ASSET_TYPE_ACTIONS[assetTypeCode] ?? [];
  if (!redeemable?.hasMaturityDate || !redeemable?.hasFaceValue) {
    return actions.filter((a) => a.type !== "redemption");
  }
  return actions;
}
