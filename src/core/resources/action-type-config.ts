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

export const CATEGORY_FORM_CONFIG: Record<string, FormFieldConfig> = {
  EQUITY: { showUnits: true, showPricePerUnit: true, unitsLabel: "Shares", priceLabel: "Price per Share" },
  FUND: { showUnits: true, showPricePerUnit: true, unitsLabel: "Units", priceLabel: "NAV per Unit" },
  FIXED_INCOME: { showUnits: true, showPricePerUnit: true, unitsLabel: "Face Value", priceLabel: "Price per Unit" },
  CASH: { showUnits: false, showPricePerUnit: false, unitsLabel: "Units", priceLabel: "Amount" },
};

export function getFormConfig(category?: string): FormFieldConfig {
  if (!category) return DEFAULT_FORM_CONFIG;
  return CATEGORY_FORM_CONFIG[category] ?? DEFAULT_FORM_CONFIG;
}

export type PositionActionType = Exclude<ActionType, "other">;

export interface PositionActionConfig {
  type: PositionActionType;
  label: string;
}

export const CATEGORY_ACTIONS: Record<string, PositionActionConfig[]> = {
  EQUITY: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "dividend", label: "Record Dividend" },
  ],
  FUND: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "dividend", label: "Record Dividend" },
  ],
  FIXED_INCOME: [
    { type: "buy", label: "Buy More" },
    { type: "sell", label: "Sell" },
    { type: "interest", label: "Record Interest" },
    { type: "redemption", label: "Redeem" },
  ],
  CASH: [
    { type: "deposit", label: "Deposit" },
    { type: "sell", label: "Withdraw" },
    { type: "interest", label: "Record Interest" },
  ],
};

export function getActionsForCategory(
  category?: string,
  assetTypeCode?: string,
  redeemable?: { hasMaturityDate: boolean; hasFaceValue: boolean },
): PositionActionConfig[] {
  if (!category) return [];
  let actions = [...(CATEGORY_ACTIONS[category] ?? [])];

  // TIME_DEPOSIT is CASH category but supports redemption
  if (category === "CASH" && assetTypeCode === "TIME_DEPOSIT") {
    actions.push({ type: "redemption", label: "Redeem" });
  }

  if (!redeemable?.hasMaturityDate || !redeemable?.hasFaceValue) {
    actions = actions.filter((a) => a.type !== "redemption");
  }

  return actions;
}
