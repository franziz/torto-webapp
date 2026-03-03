import { useMemo } from "react";
import clsx from "clsx";

type FilledButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
  className?: string;
  color?: "primary" | "secondary" | "danger";
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
        "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none",
        buttonColor,
        props.className,
      )}
      disabled={props.loading || (props.disabled ?? false)}
      onClick={props.onClick}
    >
      {props.loading ? (
        <svg
          className="size-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        props.children
      )}
    </button>
  );
}
