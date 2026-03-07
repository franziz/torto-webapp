import clsx from "clsx";

type SummaryCardProps = {
  title: string;
  value: string;
  trend?: {
    value: string;
    positive: boolean;
  };
};

export function SummaryCard(props: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{props.title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{props.value}</p>
      {props.trend && (
        <p className={clsx("mt-1 text-sm font-medium", props.trend.positive ? "text-success-300" : "text-error-300")}>
          {props.trend.positive ? "+" : ""}
          {props.trend.value}
        </p>
      )}
    </div>
  );
}
