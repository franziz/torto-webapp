"use client";

const ALL_TAB = "ALL";

type CurrencyTabsProps = {
  currencies: string[];
  selected: string;
  onChange: (currency: string) => void;
  showAll?: boolean;
};

export { ALL_TAB };

export function CurrencyTabs({ currencies, selected, onChange, showAll }: CurrencyTabsProps) {
  const tabs = showAll ? [ALL_TAB, ...currencies] : currencies;

  if (tabs.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((currency) => (
        <button
          key={currency}
          onClick={() => onChange(currency)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            currency === selected
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {currency === ALL_TAB ? "All" : currency}
        </button>
      ))}
    </div>
  );
}
