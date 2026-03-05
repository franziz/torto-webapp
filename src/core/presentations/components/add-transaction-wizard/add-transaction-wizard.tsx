"use client";

import { useEffect } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { StepIndicator } from "@/core/presentations/components/step-indicator";
import { useAddTransactionWizard } from "@/core/presentations/components/add-transaction-wizard/use-add-transaction-wizard";
import { WizardStepAccountImpl } from "@/core/presentations/components/add-transaction-wizard/wizard-step-account-impl";
import { WizardStepAssetImpl } from "@/core/presentations/components/add-transaction-wizard/wizard-step-asset-impl";
import { WizardStepTransaction } from "@/core/presentations/components/add-transaction-wizard/wizard-step-transaction";
import { AddTransactionWizardProps } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

const STEPS = ["Account", "Asset", "Transaction"];

const STEP_INDEX = { account: 0, asset: 1, transaction: 2 } as const;

export function AddTransactionWizard(props: AddTransactionWizardProps) {
  const wizard = useAddTransactionWizard();

  useEffect(() => {
    if (props.open) wizard.reset();
  }, [props.open]);

  const handleSuccess = () => {
    props.onClose();
    props.onSuccess?.();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title="Add Transaction" size="xl">
      <div className="space-y-6">
        <StepIndicator steps={STEPS} currentIndex={STEP_INDEX[wizard.state.step]} />

        {wizard.state.step === "account" && (
          <WizardStepAccountImpl
            mode={wizard.state.accountMode}
            onInit={wizard.initAccountMode}
            onModeChange={wizard.setAccountMode}
            onNext={wizard.completeAccountStep}
            onCancel={props.onClose}
          />
        )}

        {wizard.state.step === "asset" && (
          <WizardStepAssetImpl
            accountId={wizard.state.data.accountId}
            mode={wizard.state.assetMode}
            onInit={wizard.initAssetMode}
            onModeChange={wizard.setAssetMode}
            onNext={wizard.completeAssetStep}
            onBack={wizard.goBack}
          />
        )}

        {wizard.state.step === "transaction" && (
          <WizardStepTransaction
            assetId={wizard.state.data.assetId}
            data={wizard.state.data}
            onFieldChange={wizard.updateTransactionField}
            onBack={wizard.goBack}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Modal>
  );
}
