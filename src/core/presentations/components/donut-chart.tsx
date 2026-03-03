"use client";

type DonutChartItem = {
  label: string;
  value: number;
  formattedValue: string;
};

type DonutChartProps = {
  items: DonutChartItem[];
  emptyMessage?: string;
};

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

export function DonutChart({ items, emptyMessage = "No data available." }: DonutChartProps) {
  const total = items.reduce((sum, item) => sum + Math.abs(item.value), 0);

  if (items.length === 0 || total === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">{emptyMessage}</p>;
  }

  const size = 120;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedOffset = 0;
  const segments = items.map((item, i) => {
    const fraction = Math.abs(item.value) / total;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const offset = -accumulatedOffset + circumference * 0.25;
    accumulatedOffset += dash;

    return { item, dash, gap, offset, color: COLORS[i % COLORS.length], fraction };
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {segments.length === 1 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segments[0].color}
              strokeWidth={strokeWidth}
            />
          ) : (
            segments.map((seg, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={seg.offset}
                className="transition-all duration-300"
              />
            ))
          )}
        </svg>
      </div>

      <ul className="w-full space-y-1.5">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="min-w-0 flex-1 truncate text-gray-700">{seg.item.label}</span>
            <span className="shrink-0 text-gray-400">{(seg.fraction * 100).toFixed(1)}%</span>
            <span className="shrink-0 font-medium text-gray-900">{seg.item.formattedValue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
