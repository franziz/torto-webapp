import { ActionType } from "@/core/resources/action-type-config";

export type AddFlowStep = "action" | "asset" | "form";

export type AddFlowData = {
  actionType: ActionType | null;
  accountId: string;
  accountCurrency: string;
  assetId: string;
  assetTypeCode: string;
  transactionTypeId: string;
  units: string;
  pricePerUnit: string;
  totalAmount: string;
  currency: string;
  transactionDate: string;
  notes: string;
};

export type AddFlowState = {
  step: AddFlowStep;
  data: AddFlowData;
};

export type AddFlowProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};
