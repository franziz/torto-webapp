import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  color?: "gray" | "green" | "blue" | "red" | "yellow";
};

export function Badge(props: BadgeProps) {
  const color = props.color ?? "gray";
  return (
    <span
      className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", {
        "bg-gray-100 text-gray-700": color === "gray",
        "bg-green-100 text-green-700": color === "green",
        "bg-blue-100 text-blue-700": color === "blue",
        "bg-red-100 text-red-700": color === "red",
        "bg-yellow-100 text-yellow-700": color === "yellow",
      })}
    >
      {props.children}
    </span>
  );
}
