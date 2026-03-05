import { useMemo } from "react";
import clsx from "clsx";
import { Spinner } from "@/core/presentations/components/spinner";
import { BUTTON_SIZE_CLASSES } from "@/core/presentations/components/form-field";
import type { ComponentSize } from "@/core/presentations/components/form-field";

type FilledButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
  className?: string;
  color?: "primary" | "secondary" | "danger";
  size?: ComponentSize;
};

export function FilledButton(props: FilledButtonProps) {
  const buttonColor = useMemo(() => {
    const colors = {
      primary: "bg-primary-300 hover:bg-primary-400 focus-visible:outline-primary-300 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 focus-visible:outline-gray-300 text-gray-900",
      danger: "bg-red-500 hover:bg-red-600 focus-visible:outline-red-600 text-white",
    };
    return colors[props.color ?? "primary"];
  }, [props.color]);

  return (
    <button
      type={props.type ?? "submit"}
      className={clsx(
        "inline-flex w-full justify-center rounded-md shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none",
        BUTTON_SIZE_CLASSES[props.size ?? "default"],
        buttonColor,
        props.className,
      )}
      disabled={props.loading || (props.disabled ?? false)}
      onClick={props.onClick}
    >
      {props.loading ? <Spinner className="text-white" /> : props.children}
    </button>
  );
}
