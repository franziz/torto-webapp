import { PageHeading } from "@/core/presentations/components/page-heading";
import { TransactionListImpl } from "@/app/(authenticated)/wealth/transactions/_components/transaction-list-impl";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeading>Transactions</PageHeading>
      <TransactionListImpl />
    </div>
  );
}
