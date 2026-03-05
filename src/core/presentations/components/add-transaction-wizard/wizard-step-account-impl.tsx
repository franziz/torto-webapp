"use client";

import { useEffect, useRef } from "react";
import { useListAccounts } from "@/features/account/presentation/hooks/use-list-accounts";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { WizardStepAccount } from "@/core/presentations/components/add-transaction-wizard/wizard-step-account";
import { StepMode } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

type WizardStepAccountImplProps = {
  mode: StepMode;
  onInit: (hasAccounts: boolean) => void;
  onModeChange: (mode: StepMode) => void;
  onNext: (accountId: string, currency: string) => void;
  onCancel: () => void;
};

export function WizardStepAccountImpl(props: WizardStepAccountImplProps) {
  const { accounts, loading, error } = useListAccounts({ page: 1, limit: 100 });
  const initialized = useRef(false);

  useEffect(() => {
    if (!loading && accounts && !initialized.current) {
      initialized.current = true;
      props.onInit(accounts.length > 0);
    }
  }, [loading, accounts, props.onInit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay>{error.message}</ErrorDisplay>;
  }

  return (
    <WizardStepAccount
      mode={props.mode}
      accounts={accounts ?? []}
      onModeChange={props.onModeChange}
      onNext={props.onNext}
      onCancel={props.onCancel}
    />
  );
}
