"use client";

type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

export function SelectInput(props: SelectInputProps) {
  return (
    <div className={props.className}>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1">
        <select
          value={props.value ?? ""}
          onChange={(e) => props.onChange?.(e.target.value)}
          required={props.required}
          className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-300"
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {props.error && <p className="mt-1 text-sm text-red-600">{props.error}</p>}
    </div>
  );
}
