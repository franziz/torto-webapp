"use client";

import { FormField, INPUT_SIZE_CLASSES } from "@/core/presentations/components/form-field";
import type { BaseInputProps } from "@/core/presentations/components/form-field";

type TextareaInputProps = BaseInputProps & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
};

export function TextareaInput(props: TextareaInputProps) {
  const sizeClasses = INPUT_SIZE_CLASSES[props.size ?? "default"];

  return (
    <FormField label={props.label} error={props.error} className={props.className}>
      <textarea
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        required={props.required}
        rows={props.rows ?? 3}
        className={`block w-full rounded-md bg-white px-3 ${sizeClasses} text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-300`}
      />
    </FormField>
  );
}
