"use client";

import { useState, useCallback } from "react";
import { DateTime } from "luxon";
import { ActionType } from "@/core/resources/action-type-config";
import { AddFlowState, AddFlowPreset } from "@/core/presentations/components/add-flow/add-flow.types";

const INITIAL_STATE: AddFlowState = {
  step: "action",
  data: {
    actionType: null,
    accountId: "",
    accountCurrency: "",
    assetId: "",
    assetTypeCode: "",
    transactionTypeId: "",
    units: "",
    pricePerUnit: "",
    totalAmount: "",
    currency: "",
    transactionDate: DateTime.now().toISODate() ?? "",
    notes: "",
  },
};

function buildPresetState(preset: AddFlowPreset): AddFlowState {
  return {
    step: "form",
    data: {
      ...INITIAL_STATE.data,
      actionType: preset.actionType,
      assetId: preset.assetId,
      assetTypeCode: preset.assetTypeCode,
      currency: preset.currency,
    },
  };
}

export function useAddFlow() {
  const [state, setState] = useState<AddFlowState>(INITIAL_STATE);

  const selectAction = useCallback((actionType: ActionType) => {
    setState((prev) => ({
      ...prev,
      step: "asset",
      data: { ...prev.data, actionType },
    }));
  }, []);

  const selectAsset = useCallback(
    (params: { assetId: string; assetTypeCode: string; currency: string; accountId?: string }) => {
      setState((prev) => ({
        ...prev,
        step: "form",
        data: {
          ...prev.data,
          assetId: params.assetId,
          assetTypeCode: params.assetTypeCode,
          currency: params.currency,
          accountId: params.accountId ?? prev.data.accountId,
        },
      }));
    },
    [],
  );

  const updateField = useCallback((field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.step === "form") return { ...prev, step: "asset" };
      if (prev.step === "asset") return { ...prev, step: "action" };
      return prev;
    });
  }, []);

  const reset = useCallback((preset?: AddFlowPreset) => {
    setState(preset ? buildPresetState(preset) : INITIAL_STATE);
  }, []);

  return {
    state,
    selectAction,
    selectAsset,
    updateField,
    goBack,
    reset,
  };
}
