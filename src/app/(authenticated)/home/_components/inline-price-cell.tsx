"use client";

import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "@/core/helpers/format-currency";

interface InlinePriceCellProps {
  positionAssetId: string;
  currentPrice: number | undefined;
  currency: string;
  isMarketPriced: boolean;
  onSave: (assetId: string, price: number) => Promise<void>;
}

export function InlinePriceCell({ positionAssetId, currentPrice, currency, isMarketPriced, onSave }: InlinePriceCellProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (isMarketPriced) {
    return (
      <span className="group relative cursor-default text-xs text-gray-400">
        {currentPrice != null ? formatCurrency(currentPrice, currency, 4) : "\u2014"}
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
          Auto-updated market price
        </span>
      </span>
    );
  }

  const handleStartEdit = () => {
    setInputValue(currentPrice != null ? String(currentPrice) : "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (savingRef.current) return;
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed < 0) {
      setEditing(false);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      await onSave(positionAssetId, parsed);
    } finally {
      savingRef.current = false;
      setSaving(false);
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={saving}
        className="w-24 rounded border border-gray-300 px-1.5 py-0.5 text-sm text-gray-900 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartEdit}
      className="cursor-pointer rounded px-1 text-left text-xs text-gray-400 hover:bg-gray-100"
      title="Click to edit price"
    >
      {saving ? (
        <span className="text-gray-400">Saving...</span>
      ) : currentPrice != null ? (
        formatCurrency(currentPrice, currency, 4)
      ) : (
        <span className="text-gray-400">Set price</span>
      )}
    </button>
  );
}
