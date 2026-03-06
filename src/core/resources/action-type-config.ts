export type ActionType = "buy" | "sell" | "deposit" | "dividend" | "interest" | "other";

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
