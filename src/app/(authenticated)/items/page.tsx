import { PageHeading } from "@/core/presentations/components/page-heading";
import { ItemListImpl } from "@/app/(authenticated)/items/_components/item-list-impl";

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Items</PageHeading>
      <ItemListImpl />
    </div>
  );
}
