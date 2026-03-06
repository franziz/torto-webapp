"use client";

import { useEffect } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { useAddFlow } from "@/core/presentations/components/add-flow/use-add-flow";
import { ActionSelectStep } from "@/core/presentations/components/add-flow/steps/action-select-step";
import { AssetSelectStep } from "@/core/presentations/components/add-flow/steps/asset-select-step";
import { TransactionFormStep } from "@/core/presentations/components/add-flow/steps/transaction-form-step";
import { AddFlowProps } from "@/core/presentations/components/add-flow/add-flow.types";

const STEP_TITLES: Record<string, string> = {
  action: "Record Activity",
  asset: "Select Asset",
  form: "Enter Details",
};

export function AddFlow(props: AddFlowProps) {
  const flow = useAddFlow();

  useEffect(() => {
    if (props.open) flow.reset();
  }, [props.open]);

  const handleSuccess = () => {
    props.onClose();
    props.onSuccess?.();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title={STEP_TITLES[flow.state.step]} size="xl">
      <div className="space-y-6">
        {flow.state.step === "action" && (
          <ActionSelectStep onSelect={flow.selectAction} onCancel={props.onClose} />
        )}

        {flow.state.step === "asset" && (
          <AssetSelectStep
            actionType={flow.state.data.actionType!}
            onSelect={flow.selectAsset}
            onBack={flow.goBack}
          />
        )}

        {flow.state.step === "form" && (
          <TransactionFormStep
            data={flow.state.data}
            onFieldChange={flow.updateField}
            onBack={flow.goBack}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Modal>
  );
}
