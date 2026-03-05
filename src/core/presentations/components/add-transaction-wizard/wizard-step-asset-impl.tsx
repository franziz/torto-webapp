"use client";

import { useEffect, useRef } from "react";
import { useListAssets } from "@/features/asset/presentation/hooks/use-list-assets";
import { useListAssetTypes } from "@/features/asset-type/presentation/hooks/use-list-asset-types";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { WizardStepAsset } from "@/core/presentations/components/add-transaction-wizard/wizard-step-asset";
import { StepMode } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

type WizardStepAssetImplProps = {
  accountId: string;
  mode: StepMode;
  onInit: (hasAssets: boolean) => void;
  onModeChange: (mode: StepMode) => void;
  onNext: (assetId: string) => void;
  onBack: () => void;
};

export function WizardStepAssetImpl(props: WizardStepAssetImplProps) {
  const { assets, loading: assetsLoading, error: assetsError } = useListAssets({ page: 1, limit: 100, accountId: props.accountId });
  const { assetTypes, loading: typesLoading, error: typesError } = useListAssetTypes({ page: 1, limit: 100 });
  const initialized = useRef(false);

  useEffect(() => {
    if (!assetsLoading && assets && !initialized.current) {
      initialized.current = true;
      props.onInit(assets.length > 0);
    }
  }, [assetsLoading, assets, props.onInit]);

  if (assetsLoading || typesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (assetsError || typesError) {
    return <ErrorDisplay>{(assetsError ?? typesError)?.message ?? "Failed to load data"}</ErrorDisplay>;
  }

  return (
    <WizardStepAsset
      mode={props.mode}
      assets={assets ?? []}
      assetTypes={assetTypes ?? []}
      accountId={props.accountId}
      onModeChange={props.onModeChange}
      onNext={props.onNext}
      onBack={props.onBack}
    />
  );
}
