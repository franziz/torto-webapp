"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
}
