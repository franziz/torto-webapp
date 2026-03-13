"use client";

import { useEffect, useState, useMemo } from "react";
import { TextInput } from "@/core/presentations/components/text-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { DateInput } from "@/core/presentations/components/date-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { useListTransactionTypes } from "@/features/transaction-type/presentation/hooks/use-list-transaction-types";
import { useCreateTransaction } from "@/features/transaction/presentation/hooks/use-create-transaction";
import { CreateTransactionUseCaseParams } from "@/features/transaction/domain/usecases/create-transaction.usecases";
import { getFormConfig, ACTION_TYPE_OPTIONS, ActionType } from "@/core/resources/action-type-config";
import { AddFlowData } from "@/core/presentations/components/add-flow/add-flow.types";

type TransactionFormStepProps = {
  data: AddFlowData;
  onFieldChange: (field: string, value: string) => void;
  onBack: () => void;
  onSuccess: () => void;
};

export function TransactionFormStep({ data, onFieldChange, onBack, onSuccess }: TransactionFormStepProps) {
  const { transactionTypes, loading: typesLoading } = useListTransactionTypes({ page: 1, limit: 100 });
  const { trigger, loading: creating } = useCreateTransaction();
  const [error, setError] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<"units" | "pricePerUnit" | "totalAmount">("units");

  const formConfig = getFormConfig(data.assetTypeCategory);
  const isOther = data.actionType === "other";

  const resolvedTransactionTypeId = useMemo(() => {
    if (isOther || !data.actionType || !transactionTypes) return data.transactionTypeId;
    const actionConfig = ACTION_TYPE_OPTIONS.find((o) => o.type === data.actionType);
    if (!actionConfig?.transactionTypeCode) return data.transactionTypeId;
    const matched = transactionTypes.find(
      (t) => t.code.toLowerCase() === actionConfig.transactionTypeCode.toLowerCase(),
    );
    return matched?.id ?? data.transactionTypeId;
  }, [data.actionType, data.transactionTypeId, transactionTypes, isOther]);

  useEffect(() => {
    if (resolvedTransactionTypeId && resolvedTransactionTypeId !== data.transactionTypeId) {
      onFieldChange("transactionTypeId", resolvedTransactionTypeId);
    }
  }, [resolvedTransactionTypeId]);

  useEffect(() => {
    if (!formConfig.showUnits) return;
    const u = parseFloat(data.units) || 0;
    const p = parseFloat(data.pricePerUnit) || 0;
    const t = parseFloat(data.totalAmount) || 0;

    if (lastEdited === "totalAmount") {
      if (u > 0) {
        const next = (t / u).toFixed(2);
        if (next !== data.pricePerUnit) onFieldChange("pricePerUnit", next);
      }
    } else {
      const next = (u * p).toFixed(2);
      if (next !== data.totalAmount) onFieldChange("totalAmount", next);
    }
  }, [data.units, data.pricePerUnit, data.totalAmount, lastEdited, formConfig.showUnits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const units = formConfig.showUnits ? parseFloat(data.units) : 1;
    const totalAmount = parseFloat(data.totalAmount);
    const pricePerUnit = formConfig.showUnits ? parseFloat(data.pricePerUnit) : totalAmount;

    const effectiveTypeId = resolvedTransactionTypeId || data.transactionTypeId;
    if (!data.assetId || !effectiveTypeId) {
      setError("Missing required fields.");
      return;
    }

    try {
      await trigger(
        new CreateTransactionUseCaseParams({
          assetId: data.assetId,
          transactionTypeId: effectiveTypeId,
          units,
          pricePerUnit,
          totalAmount,
          currency: data.currency,
          transactionDate: data.transactionDate,
          notes: data.notes || undefined,
        }),
      );
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Failed to record activity");
    }
  };

  if (typesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const typeOptions = (transactionTypes ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorDisplay>{error}</ErrorDisplay>}

      {isOther && (
        <SelectInput
          label="Transaction Type"
          options={typeOptions}
          value={data.transactionTypeId}
          onChange={(v) => onFieldChange("transactionTypeId", v)}
          required
          placeholder="Select type"
        />
      )}

      {formConfig.showUnits ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label={formConfig.unitsLabel}
              type="number"
              value={data.units}
              onChange={(v) => {
                setLastEdited("units");
                onFieldChange("units", v);
              }}
              required
              placeholder="0"
            />
            <TextInput
              label={formConfig.priceLabel}
              type="number"
              value={data.pricePerUnit}
              onChange={(v) => {
                setLastEdited("pricePerUnit");
                onFieldChange("pricePerUnit", v);
              }}
              required
              placeholder="0.00"
            />
          </div>
          <TextInput
            label="Total Amount"
            type="number"
            value={data.totalAmount}
            onChange={(v) => {
              setLastEdited("totalAmount");
              onFieldChange("totalAmount", v);
            }}
            required
          />
        </>
      ) : (
        <TextInput
          label="Amount"
          type="number"
          value={data.totalAmount}
          onChange={(v) => onFieldChange("totalAmount", v)}
          required
          placeholder="0.00"
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="Currency"
          value={data.currency}
          onChange={(v) => onFieldChange("currency", v)}
          required
          placeholder="SGD"
        />
        <DateInput
          label="Date"
          value={data.transactionDate}
          onChange={(v) => onFieldChange("transactionDate", v)}
          required
        />
      </div>

      <TextareaInput
        label="Notes"
        value={data.notes}
        onChange={(v) => onFieldChange("notes", v)}
        placeholder="Optional notes"
      />

      <div className="flex gap-x-3 pt-2">
        <OutlinedButton type="button" onClick={onBack}>
          Back
        </OutlinedButton>
        <FilledButton type="submit" loading={creating}>
          Record Activity
        </FilledButton>
      </div>
    </form>
  );
}
