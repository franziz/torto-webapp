"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { DateInput } from "@/core/presentations/components/date-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { useUpdateAsset } from "@/features/asset/presentation/hooks/use-update-asset";
import { UpdateAssetUseCaseParams } from "@/features/asset/domain/usecases/update-asset.usecases";
import { DateTime } from "luxon";

export type EditAssetData = {
  assetId: string;
  name: string;
  ticker?: string;
  description?: string;
  assetTypeCode?: string;
  assetTypeCategory?: string;
  maturityDate?: DateTime;
  faceValue?: number;
};

type EditAssetModalProps = {
  open: boolean;
  onClose: () => void;
  asset: EditAssetData;
  onSuccess?: () => void;
};

export function EditAssetModal({ open, onClose, asset, onSuccess }: EditAssetModalProps) {
  const { trigger, loading } = useUpdateAsset();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(asset.name);
  const [ticker, setTicker] = useState(asset.ticker ?? "");
  const [maturityDate, setMaturityDate] = useState(asset.maturityDate?.toISODate() ?? "");
  const [faceValue, setFaceValue] = useState(asset.faceValue ? String(asset.faceValue) : "");

  const showMaturityFields =
    asset.assetTypeCategory === "FIXED_INCOME" ||
    (asset.assetTypeCategory === "CASH" && asset.assetTypeCode === "TIME_DEPOSIT");

  useEffect(() => {
    if (open) {
      setName(asset.name);
      setTicker(asset.ticker ?? "");
      setMaturityDate(asset.maturityDate?.toISODate() ?? "");
      setFaceValue(asset.faceValue ? String(asset.faceValue) : "");
      setError(null);
    }
  }, [open, asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (showMaturityFields && ((maturityDate && !faceValue) || (!maturityDate && faceValue))) {
      setError("Maturity Date and Face Value must both be filled or both empty.");
      return;
    }

    try {
      await trigger(
        new UpdateAssetUseCaseParams({
          id: asset.assetId,
          name: name.trim(),
          ticker: ticker.trim() || undefined,
          description: asset.description,
          maturityDate: maturityDate || undefined,
          faceValue: faceValue ? parseFloat(faceValue) : undefined,
        }),
      );
      onClose();
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update asset");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${asset.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorDisplay>{error}</ErrorDisplay>}

        <TextInput label="Name" value={name} onChange={setName} required placeholder="Asset name" />
        <TextInput label="Ticker" value={ticker} onChange={setTicker} placeholder="e.g. SR012 (optional)" />

        {showMaturityFields && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput label="Maturity Date" value={maturityDate} onChange={setMaturityDate} />
            <TextInput
              label="Face Value / Unit"
              type="number"
              value={faceValue}
              onChange={setFaceValue}
              placeholder="e.g. 1000000"
            />
          </div>
        )}

        <div className="flex gap-x-3 pt-2">
          <OutlinedButton type="button" onClick={onClose}>
            Cancel
          </OutlinedButton>
          <FilledButton type="submit" loading={loading}>
            Save
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
