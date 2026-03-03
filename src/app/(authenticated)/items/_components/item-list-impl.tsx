"use client";

import { useListItems } from "@/features/item/presentation/hooks/use-list-items";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { DateTime } from "luxon";

export function ItemListImpl() {
  const { items, loading, error } = useListItems({ page: 1, limit: 10 });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay>{error.message}</ErrorDisplay>;
  }

  if (items.length === 0) {
    return (
      <SectionCard title="All Items">
        <p className="py-8 text-center text-sm text-gray-500">No items found.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="All Items" bodyClassName="">
      <Table.Container>
        <Table>
          <Table.Header
            items={[
              { node: "Name", hideOnMobile: false },
              { node: "Description", hideOnMobile: true },
              { node: "Created", hideOnMobile: true },
            ]}
          />
          <Table.Body
            items={items.map((item) => ({
              row: [
                {
                  node: <span className="font-medium text-gray-900">{item.name}</span>,
                  hideOnMobile: false,
                },
                { node: item.description ?? "\u2014", hideOnMobile: true },
                {
                  node: item.createdAt.toLocaleString(DateTime.DATE_MED),
                  hideOnMobile: true,
                },
              ],
            }))}
          />
        </Table>
      </Table.Container>
    </SectionCard>
  );
}
