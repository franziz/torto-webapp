"use client";

import { FormField, INPUT_SIZE_CLASSES } from "@/core/presentations/components/form-field";
import type { BaseInputProps } from "@/core/presentations/components/form-field";

type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = BaseInputProps & {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export function SelectInput(props: SelectInputProps) {
  const sizeClasses = INPUT_SIZE_CLASSES[props.size ?? "default"];

  return (
    <FormField label={props.label} error={props.error} className={props.className}>
      <div className="relative">
        <select
          value={props.value ?? ""}
          onChange={(e) => props.onChange?.(e.target.value)}
          required={props.required}
          className={`block w-full appearance-none rounded-md bg-white pr-8 pl-3 ${sizeClasses} text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-300`}
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
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </FormField>
  );
}
