export type ComponentSize = "default" | "sm";

export const INPUT_SIZE_CLASSES: Record<ComponentSize, string> = {
  default: "py-2.5 text-sm sm:py-2",
  sm: "py-1.5 text-xs",
};

export const BUTTON_SIZE_CLASSES: Record<ComponentSize, string> = {
  default: "px-3 py-2.5 text-sm font-semibold sm:py-2",
  sm: "px-2.5 py-1.5 text-xs font-semibold",
};

export type BaseInputProps = {
  label?: string;
  error?: string;
  className?: string;
  size?: ComponentSize;
  required?: boolean;
};

type FormFieldProps = {
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className={label ? "mt-1" : ""}>{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
