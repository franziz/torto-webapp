"use client";

type TextareaInputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number;
};

export function TextareaInput(props: TextareaInputProps) {
  return (
    <div className={props.className}>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1">
        <textarea
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
          required={props.required}
          rows={props.rows ?? 3}
          className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-300"
        />
      </div>
      {props.error && <p className="mt-1 text-sm text-red-600">{props.error}</p>}
    </div>
  );
}
