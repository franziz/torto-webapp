import { PageHeading } from "@/core/presentations/components/page-heading";
import { AccountListImpl } from "@/app/(authenticated)/wealth/accounts/_components/account-list-impl";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeading subtitle="Manage your broker accounts, bank accounts, and other financial accounts that hold your assets.">
        Accounts
      </PageHeading>
      <AccountListImpl />
    </div>
  );
}
