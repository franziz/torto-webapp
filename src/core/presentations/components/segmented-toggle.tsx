"use client";

type SegmentedToggleProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedToggle({ options, value, onChange }: SegmentedToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value ? "bg-primary-300 text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
