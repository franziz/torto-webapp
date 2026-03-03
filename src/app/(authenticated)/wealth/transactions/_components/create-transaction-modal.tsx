"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/core/presentations/components/modal";
import { TextInput } from "@/core/presentations/components/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextareaInput } from "@/core/presentations/components/textarea-input";
import { DateInput } from "@/core/presentations/components/date-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useCreateTransaction } from "@/features/transaction/presentation/hooks/use-create-transaction";
import { CreateTransactionUseCaseParams } from "@/features/transaction/domain/usecases/create-transaction.usecases";
import { AssetEntity } from "@/features/asset/domain/entities/asset";
import { TransactionTypeEntity } from "@/features/transaction-type/domain/entities/transaction-type";
import { DateTime } from "luxon";

type CreateTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  assets: AssetEntity[];
  transactionTypes: TransactionTypeEntity[];
};

export function CreateTransactionModal(props: CreateTransactionModalProps) {
  const { trigger, loading } = useCreateTransaction();
  const [assetId, setAssetId] = useState("");
  const [transactionTypeId, setTransactionTypeId] = useState("");
  const [units, setUnits] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [fee, setFee] = useState("0");
  const [currency, setCurrency] = useState("");
  const [transactionDate, setTransactionDate] = useState(DateTime.now().toISODate() ?? "");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const u = parseFloat(units) || 0;
    const p = parseFloat(pricePerUnit) || 0;
    setTotalAmount((u * p).toFixed(2));
  }, [units, pricePerUnit]);

  useEffect(() => {
    if (assetId) {
      const asset = props.assets.find((a) => a.id === assetId);
      if (asset?.accountCurrency) setCurrency(asset.accountCurrency);
    }
  }, [assetId, props.assets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trigger(
      new CreateTransactionUseCaseParams({
        assetId,
        transactionTypeId,
        units: parseFloat(units),
        pricePerUnit: parseFloat(pricePerUnit),
        totalAmount: parseFloat(totalAmount),
        fee: parseFloat(fee) || 0,
        currency,
        transactionDate,
        notes: notes || undefined,
      }),
    );
    setAssetId("");
    setTransactionTypeId("");
    setUnits("");
    setPricePerUnit("");
    setTotalAmount("");
    setFee("0");
    setCurrency("");
    setTransactionDate(DateTime.now().toISODate() ?? "");
    setNotes("");
    props.onClose();
  };

  const assetOptions = props.assets.map((a) => ({
    label: `${a.name}${a.ticker ? ` (${a.ticker})` : ""}`,
    value: a.id,
  }));
  const typeOptions = props.transactionTypes.map((t) => ({ label: t.name, value: t.id }));

  return (
    <Modal open={props.open} onClose={props.onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectInput
          label="Asset"
          options={assetOptions}
          value={assetId}
          onChange={setAssetId}
          required
          placeholder="Select asset"
        />
        <SelectInput
          label="Transaction Type"
          options={typeOptions}
          value={transactionTypeId}
          onChange={setTransactionTypeId}
          required
          placeholder="Select type"
        />
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Units" type="number" value={units} onChange={setUnits} required placeholder="0" />
          <TextInput
            label="Price per Unit"
            type="number"
            value={pricePerUnit}
            onChange={setPricePerUnit}
            required
            placeholder="0.00"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Total Amount" type="number" value={totalAmount} onChange={setTotalAmount} required />
          <TextInput label="Fee" type="number" value={fee} onChange={setFee} placeholder="0.00" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Currency" value={currency} onChange={setCurrency} required placeholder="SGD" />
          <DateInput label="Date" value={transactionDate} onChange={setTransactionDate} required />
        </div>
        <TextareaInput label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes" />
        <div className="flex gap-x-3 pt-2">
          <OutlinedButton type="button" onClick={props.onClose}>
            Cancel
          </OutlinedButton>
          <FilledButton type="submit" loading={loading}>
            Create
          </FilledButton>
        </div>
      </form>
    </Modal>
  );
}
