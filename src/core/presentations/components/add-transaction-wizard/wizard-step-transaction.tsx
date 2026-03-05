"use client";

import { useEffect, useState } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { DateInput } from "@/core/presentations/components/date-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { useListTransactionTypes } from "@/features/transaction-type/presentation/hooks/use-list-transaction-types";
import { useCreateTransaction } from "@/features/transaction/presentation/hooks/use-create-transaction";
import { CreateTransactionUseCaseParams } from "@/features/transaction/domain/usecases/create-transaction.usecases";
import { WizardData } from "@/core/presentations/components/add-transaction-wizard/add-transaction-wizard.types";

type WizardStepTransactionProps = {
  assetId: string;
  data: WizardData;
  onFieldChange: (field: string, value: string) => void;
  onBack: () => void;
  onSuccess: () => void;
};

export function WizardStepTransaction(props: WizardStepTransactionProps) {
  const { transactionTypes, loading: typesLoading } = useListTransactionTypes({ page: 1, limit: 100 });
  const { trigger, loading: creating } = useCreateTransaction();
  const [error, setError] = useState<string | null>(null);

  const [lastEdited, setLastEdited] = useState<"units" | "pricePerUnit" | "totalAmount">("units");

  useEffect(() => {
    const u = parseFloat(props.data.units) || 0;
    const p = parseFloat(props.data.pricePerUnit) || 0;
    const t = parseFloat(props.data.totalAmount) || 0;

    if (lastEdited === "totalAmount") {
      if (u > 0) props.onFieldChange("pricePerUnit", (t / u).toFixed(2));
    } else {
      props.onFieldChange("totalAmount", (u * p).toFixed(2));
    }
  }, [props.data.units, props.data.pricePerUnit, props.data.totalAmount, lastEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await trigger(
        new CreateTransactionUseCaseParams({
          assetId: props.assetId,
          transactionTypeId: props.data.transactionTypeId,
          units: parseFloat(props.data.units),
          pricePerUnit: parseFloat(props.data.pricePerUnit),
          totalAmount: parseFloat(props.data.totalAmount),

          currency: props.data.currency,
          transactionDate: props.data.transactionDate,
          notes: props.data.notes || undefined,
        }),
      );
      props.onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create transaction");
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
      <SelectInput
        label="Transaction Type"
        options={typeOptions}
        value={props.data.transactionTypeId}
        onChange={(v) => props.onFieldChange("transactionTypeId", v)}
        required
        placeholder="Select type"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="Units"
          type="number"
          value={props.data.units}
          onChange={(v) => { setLastEdited("units"); props.onFieldChange("units", v); }}
          required
          placeholder="0"
        />
        <TextInput
          label="Price per Unit"
          type="number"
          value={props.data.pricePerUnit}
          onChange={(v) => { setLastEdited("pricePerUnit"); props.onFieldChange("pricePerUnit", v); }}
          required
          placeholder="0.00"
        />
      </div>
      <TextInput
        label="Total Amount"
        type="number"
        value={props.data.totalAmount}
        onChange={(v) => { setLastEdited("totalAmount"); props.onFieldChange("totalAmount", v); }}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput
          label="Currency"
          value={props.data.currency}
          onChange={(v) => props.onFieldChange("currency", v)}
          required
          placeholder="SGD"
        />
        <DateInput
          label="Date"
          value={props.data.transactionDate}
          onChange={(v) => props.onFieldChange("transactionDate", v)}
          required
        />
      </div>
      <TextareaInput
        label="Notes"
        value={props.data.notes}
        onChange={(v) => props.onFieldChange("notes", v)}
        placeholder="Optional notes"
      />
      <div className="flex gap-x-3 pt-2">
        <OutlinedButton type="button" onClick={props.onBack}>
          Back
        </OutlinedButton>
        <FilledButton type="submit" loading={creating}>
          Create Transaction
        </FilledButton>
      </div>
    </form>
  );
}
