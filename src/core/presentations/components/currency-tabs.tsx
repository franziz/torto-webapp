"use client";

type CurrencyTabsProps = {
  currencies: string[];
  selected: string;
  onChange: (currency: string) => void;
};

export function CurrencyTabs({ currencies, selected, onChange }: CurrencyTabsProps) {
  if (currencies.length <= 1) return null;

  return (
    <div className="flex gap-2">
      {currencies.map((currency) => (
        <button
          key={currency}
          onClick={() => onChange(currency)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            currency === selected
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}
