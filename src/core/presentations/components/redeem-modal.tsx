"use client";

import { useState, useMemo, useEffect } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { DateInput } from "@/core/presentations/components/date-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Spinner } from "@/core/presentations/components/spinner";
import { DataCardRow } from "@/core/presentations/components/data-card";
import { formatCurrency } from "@/core/helpers/format-currency";
import { useCreateTransaction } from "@/features/transaction/presentation/hooks/use-create-transaction";
import { CreateTransactionUseCaseParams } from "@/features/transaction/domain/usecases/create-transaction.usecases";
import { useListTransactionTypes } from "@/features/transaction-type/presentation/hooks/use-list-transaction-types";
import { PositionEntity } from "@/features/position/domain/entities/position";
import { DateTime } from "luxon";

type RedeemModalProps = {
  open: boolean;
  onClose: () => void;
  position: PositionEntity;
  onSuccess?: () => void;
};

export function RedeemModal({ open, onClose, position, onSuccess }: RedeemModalProps) {
  const { trigger, loading: creating } = useCreateTransaction();
  const { transactionTypes, loading: typesLoading } = useListTransactionTypes({ page: 1, limit: 100 });
  const [error, setError] = useState<string | null>(null);

  const maturityDate = position.assetMaturityDate;
  const faceValue = position.assetFaceValue ?? 0;
  const today = DateTime.now().toISODate()!;
  const maturityIso = maturityDate?.toISODate();
  const defaultDate = maturityIso && maturityIso <= today ? maturityIso : today;

  const [units, setUnits] = useState(String(position.totalUnits));
  const [date, setDate] = useState(defaultDate);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setUnits(String(position.totalUnits));
      setDate(defaultDate);
      setNotes("");
      setError(null);
    }
  }, [open, position.totalUnits, defaultDate]);

  const redemptionTypeId = useMemo(() => {
    if (!transactionTypes) return null;
    const matched = transactionTypes.find((t) => t.code.toLowerCase() === "redemption");
    return matched?.id ?? null;
  }, [transactionTypes]);

  const parsedUnits = parseFloat(units) || 0;
  const redemptionAmount = parsedUnits * faceValue;
  const costBasis = position.totalUnits > 0 ? (parsedUnits / position.totalUnits) * position.totalCost : 0;
  const realizedGain = redemptionAmount - costBasis;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!redemptionTypeId) {
      setError("Redemption transaction type not found. Please contact support.");
      return;
    }

    if (parsedUnits <= 0) {
      setError("Units to redeem must be greater than 0.");
      return;
    }

    if (parsedUnits > position.totalUnits) {
      setError(`Cannot redeem more than ${position.totalUnits} units.`);
      return;
    }

    try {
      await trigger(
        new CreateTransactionUseCaseParams({
          assetId: position.assetId,
          transactionTypeId: redemptionTypeId,
          units: parsedUnits,
          pricePerUnit: faceValue,
          totalAmount: redemptionAmount,
          currency: position.currency,
          transactionDate: date,
          notes: notes || undefined,
        }),
      );
      onClose();
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to process redemption");
    }
  };

  if (typesLoading) {
    return (
      <Modal open={open} onClose={onClose} title={`Redeem ${position.assetName ?? ""}`}>
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Redeem ${position.assetName ?? ""}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorDisplay>{error}</ErrorDisplay>}

        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          {maturityDate && (
            <DataCardRow label="Maturity Date" value={maturityDate.toFormat("d MMM yyyy")} />
          )}
          <DataCardRow label="Face Value / Unit" value={formatCurrency(faceValue, position.currency)} />
          <DataCardRow label="Current Holdings" value={`${position.totalUnits} units`} />
        </div>

        <TextInput
          label="Units to Redeem"
          type="number"
          value={units}
          onChange={setUnits}
          required
          placeholder="0"
        />

        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          <DataCardRow
            label="Redemption Amount"
            value={<span className="font-semibold">{formatCurrency(redemptionAmount, position.currency)}</span>}
          />
          <DataCardRow
            label="Cost Basis"
            value={formatCurrency(costBasis, position.currency)}
          />
          <DataCardRow
            label="Realized Gain"
            value={
              <span className={realizedGain >= 0 ? "text-success-300" : "text-error-300"}>
                {realizedGain >= 0 ? "+" : ""}
                {formatCurrency(realizedGain, position.currency)}
              </span>
            }
          />
        </div>

        <DateInput label="Date" value={date} onChange={setDate} required />

        <TextareaInput label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes" />

        <div className="flex gap-x-3 pt-2">
          <OutlinedButton type="button" onClick={onClose}>
            Cancel
          </OutlinedButton>
          <FilledButton type="submit" loading={creating}>
            Confirm Redemption
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
