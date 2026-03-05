"use client";

import { useState, useCallback } from "react";
import { DateTime } from "luxon";
import { WizardState, StepMode } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

const INITIAL_STATE: WizardState = {
  step: "account",
  accountMode: "select",
  assetMode: "select",
  data: {
    accountId: "",
    accountCurrency: "",
    assetId: "",
    transactionTypeId: "",
    units: "",
    pricePerUnit: "",
    totalAmount: "",

    currency: "",
    transactionDate: DateTime.now().toISODate() ?? "",
    notes: "",
  },
};

export function useAddTransactionWizard() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  const initAccountMode = useCallback((hasAccounts: boolean) => {
    setState((prev) => ({
      ...prev,
      accountMode: hasAccounts ? "select" : "create",
    }));
  }, []);

  const initAssetMode = useCallback((hasAssets: boolean) => {
    setState((prev) => ({
      ...prev,
      assetMode: hasAssets ? "select" : "create",
    }));
  }, []);

  const setAccountMode = useCallback((mode: StepMode) => {
    setState((prev) => ({ ...prev, accountMode: mode }));
  }, []);

  const setAssetMode = useCallback((mode: StepMode) => {
    setState((prev) => ({ ...prev, assetMode: mode }));
  }, []);

  const completeAccountStep = useCallback((accountId: string, currency: string) => {
    setState((prev) => ({
      ...prev,
      step: "asset",
      data: { ...prev.data, accountId, accountCurrency: currency, currency },
    }));
  }, []);

  const completeAssetStep = useCallback((assetId: string) => {
    setState((prev) => ({
      ...prev,
      step: "transaction",
      data: { ...prev.data, assetId },
    }));
  }, []);

  const updateTransactionField = useCallback((field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.step === "transaction") return { ...prev, step: "asset" };
      if (prev.step === "asset") return { ...prev, step: "account" };
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    initAccountMode,
    initAssetMode,
    setAccountMode,
    setAssetMode,
    completeAccountStep,
    completeAssetStep,
    updateTransactionField,
    goBack,
    reset,
  };
}
