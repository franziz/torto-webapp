export type WizardStep = "account" | "asset" | "transaction";

export type StepMode = "select" | "create";

export type WizardData = {
  accountId: string;
  accountCurrency: string;
  assetId: string;
  transactionTypeId: string;
  units: string;
  pricePerUnit: string;
  totalAmount: string;

  currency: string;
  transactionDate: string;
  notes: string;
};

export type WizardState = {
  step: WizardStep;
  accountMode: StepMode;
  assetMode: StepMode;
  data: WizardData;
};

export type AddTransactionWizardProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};
