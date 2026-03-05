import clsx from "clsx";
import { Spinner } from "@/core/presentations/components/spinner";
import { BUTTON_SIZE_CLASSES } from "@/core/presentations/components/form-field";
import type { ComponentSize } from "@/core/presentations/components/form-field";

type OutlinedButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
  className?: string;
  size?: ComponentSize;
};

export function OutlinedButton(props: OutlinedButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      className={clsx(
        "inline-flex w-full justify-center rounded-md bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 disabled:cursor-not-allowed disabled:bg-white disabled:text-neutral-200 disabled:shadow-none disabled:ring-neutral-100",
        BUTTON_SIZE_CLASSES[props.size ?? "default"],
        props.className,
      )}
      disabled={props.loading || (props.disabled ?? false)}
      onClick={props.onClick}
    >
      {props.loading ? <Spinner className="text-gray-900" /> : props.children}
    </button>
  );
}
