"use client";

type DateInputProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
};

export function DateInput(props: DateInputProps) {
  return (
    <div className={props.className}>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1">
        <input
          type="date"
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
          required={props.required}
          className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-300"
        />
      </div>
      {props.error && <p className="mt-1 text-sm text-red-600">{props.error}</p>}
    </div>
  );
}
