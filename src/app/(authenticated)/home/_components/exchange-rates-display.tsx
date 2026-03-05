type ExchangeRatesDisplayProps = {
  rates: Record<string, number>;
  targetCurrency: string;
};

export function ExchangeRatesDisplay({ rates, targetCurrency }: ExchangeRatesDisplayProps) {
  const entries = Object.entries(rates);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
      {entries.map(([key, rate]) => {
        const [from, to] = key.split("_");
        let label: string;

        if (rate < 1) {
          const inverted = 1 / rate;
          label = `1 ${to} = ${inverted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${from}`;
        } else {
          label = `1 ${from} = ${rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`;
        }

        return <span key={key}>{label}</span>;
      })}
    </div>
  );
}
