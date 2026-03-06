import { PageHeading } from "@/core/presentations/components/page-heading";
import { InvestmentsListImpl } from "@/app/(authenticated)/investments/_components/investments-list-impl";

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Investments</PageHeading>
      <InvestmentsListImpl />
    </div>
  );
}
