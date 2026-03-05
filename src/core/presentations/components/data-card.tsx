type DataCardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function DataCard({ children, onClick, className }: DataCardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-4 ${onClick ? "cursor-pointer active:bg-gray-50" : ""} ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

type DataCardRowProps = {
  label: string;
  value: React.ReactNode;
};

export function DataCardRow({ label, value }: DataCardRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
