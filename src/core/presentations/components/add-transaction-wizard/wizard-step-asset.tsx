"use client";

import { useState } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { SegmentedToggle } from "@/core/presentations/components/segmented-toggle";
import { useCreateAsset } from "@/features/asset/presentation/hooks/use-create-asset";
import { CreateAssetUseCaseParams } from "@/features/asset/domain/usecases/create-asset.usecases";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { AssetTypeEntity } from "@/features/asset-type/domain/entities/asset-type";
import { StepMode } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

type WizardStepAssetProps = {
  mode: StepMode;
  assets: AssetEntity[];
  assetTypes: AssetTypeEntity[];
  accountId: string;
  onModeChange: (mode: StepMode) => void;
  onNext: (assetId: string) => void;
  onBack: () => void;
};

export function WizardStepAsset(props: WizardStepAssetProps) {
  const { trigger, loading } = useCreateAsset();
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const showToggle = props.assets.length > 0;

  const handleSelectNext = () => {
    if (selectedAssetId) props.onNext(selectedAssetId);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await trigger(
        new CreateAssetUseCaseParams({
          accountId: props.accountId,
          assetTypeId,
          name,
          ticker: ticker || undefined,
          description: description || undefined,
        }),
      );
      if (result?.id) props.onNext(result.id);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create asset");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        An asset is a specific investment you own within an account (e.g. a stock like AAPL, a mutual fund, or crypto).
      </p>
      {showToggle && (
        <SegmentedToggle
          options={[
            { label: "Select Existing", value: "select" },
            { label: "Create New", value: "create" },
          ]}
          value={props.mode}
          onChange={(v) => props.onModeChange(v as StepMode)}
        />
      )}

      {props.mode === "select" ? (
        <div className="space-y-4">
          <SelectInput
            label="Asset"
            options={props.assets.map((a) => ({
              label: `${a.name}${a.ticker ? ` (${a.ticker})` : ""}`,
              value: a.id,
            }))}
            value={selectedAssetId}
            onChange={setSelectedAssetId}
            placeholder="Select an asset"
          />
          <div className="flex gap-x-3 pt-2">
            <OutlinedButton type="button" onClick={props.onBack}>
              Back
            </OutlinedButton>
            <FilledButton type="button" onClick={handleSelectNext} disabled={!selectedAssetId}>
              Next
            </FilledButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <ErrorDisplay>{error}</ErrorDisplay>}
          <TextInput label="Name" value={name} onChange={setName} required placeholder="e.g. Apple Inc." />
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Ticker" value={ticker} onChange={setTicker} placeholder="e.g. AAPL (optional)" />
            <SelectInput
              label="Asset Type"
              options={props.assetTypes.map((t) => ({ label: t.name, value: t.id }))}
              value={assetTypeId}
              onChange={setAssetTypeId}
              required
              placeholder="Select type"
            />
          </div>
          <TextareaInput label="Description" value={description} onChange={setDescription} placeholder="Optional description" />
          <div className="flex gap-x-3 pt-2">
            <OutlinedButton type="button" onClick={props.onBack}>
              Back
            </OutlinedButton>
            <FilledButton type="submit" loading={loading}>
              Create & Continue
            </FilledButton>
          </div>
        </form>
      )}
    </div>
  );
}
