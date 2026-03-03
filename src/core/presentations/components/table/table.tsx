import React from "react";

function TableContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="inline-block min-w-full align-middle">
      <div className={`overflow-hidden rounded-sm shadow-sm ring-1 ring-black/5 ${className ?? ""}`}>
        {children}
      </div>
    </div>
  );
}

function TableRoot({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full table-auto divide-y divide-gray-300 md:table-fixed">{children}</table>;
}

export interface TableHeaderItem {
  node: React.ReactNode;
  hideOnMobile: boolean;
  className?: string;
}

function TableHeader({ items }: { items: TableHeaderItem[] }) {
  const cls = (hideOnMobile: boolean, base: string) =>
    hideOnMobile ? `hidden ${base} sm:table-cell` : base;

  if (items.length === 0) return null;
  return (
    <thead className="bg-gray-50">
      <tr>
        {items.map((item, i) => (
          <th
            key={`th-${i}`}
            scope="col"
            className={cls(
              item.hideOnMobile,
              `px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${i === 0 ? "pl-4" : ""} ${item.className ?? ""}`,
            )}
          >
            {item.node}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export interface TableBodyItem {
  className?: string;
  row: {
    node: React.ReactNode;
    hideOnMobile: boolean;
    className?: string;
  }[];
}

function TableBody({ items }: { items: TableBodyItem[] }) {
  const cls = (hideOnMobile: boolean, base: string) =>
    hideOnMobile ? `hidden ${base} sm:table-cell` : base;

  if (items.length === 0) return null;
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {items.map((data, rowIdx) => (
        <tr key={`row-${rowIdx}`} className={data.className}>
          {data.row.map((cell, cellIdx) => (
            <td
              key={`cell-${cellIdx}`}
              className={cls(
                cell.hideOnMobile,
                `px-3 py-4 text-left text-sm whitespace-nowrap text-gray-500 ${cellIdx === 0 ? "pl-4" : ""} ${cell.className ?? ""}`,
              )}
            >
              {cell.node}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export const Table = Object.assign(TableRoot, {
  Container: TableContainer,
  Header: TableHeader,
  Body: TableBody,
});
