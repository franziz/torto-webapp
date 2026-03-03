"use client";

import { useState } from "react";
import { useListAccounts } from "@/features/account/presentation/hooks/use-list-accounts";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Spinner } from "@/core/presentations/components/spinner";
import { ErrorDisplay } from "@/core/presentations/components/error-display";
import { Table } from "@/core/presentations/components/table/table";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { CreateAccountModal } from "@/app/(authenticated)/wealth/accounts/_components/create-account-modal";
import { EditAccountModal } from "@/app/(authenticated)/wealth/accounts/_components/edit-account-modal";
import { DeleteAccountDialog } from "@/app/(authenticated)/wealth/accounts/_components/delete-account-dialog";
import { AccountEntity } from "@/features/account/domain/entities/account";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export function AccountListImpl() {
  const { accounts, loading, error } = useListAccounts({ page: 1, limit: 50 });
  const [createOpen, setCreateOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<AccountEntity | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<AccountEntity | null>(null);

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

  return (
    <>
      <SectionCard
        title="All Accounts"
        headerAction={
          <FilledButton type="button" onClick={() => setCreateOpen(true)} className="w-auto">
            Add Account
          </FilledButton>
        }
        bodyClassName=""
      >
        {accounts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No accounts found.</p>
        ) : (
          <Table.Container>
            <Table>
              <Table.Header
                items={[
                  { node: "Name", hideOnMobile: false },
                  { node: "Country", hideOnMobile: true },
                  { node: "Currency", hideOnMobile: true },
                  { node: "Description", hideOnMobile: true },
                  { node: "", hideOnMobile: false, className: "w-24" },
                ]}
              />
              <Table.Body
                items={accounts.map((account) => ({
                  row: [
                    {
                      node: <span className="font-medium text-gray-900">{account.name}</span>,
                      hideOnMobile: false,
                    },
                    { node: account.country, hideOnMobile: true },
                    { node: account.currency, hideOnMobile: true },
                    { node: account.description ?? "\u2014", hideOnMobile: true },
                    {
                      node: (
                        <div className="flex items-center gap-x-2">
                          <button
                            type="button"
                            onClick={() => setEditAccount(account)}
                            className="text-gray-400 hover:text-primary-300"
                          >
                            <PencilSquareIcon className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteAccount(account)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      ),
                      hideOnMobile: false,
                    },
                  ],
                }))}
              />
            </Table>
          </Table.Container>
        )}
      </SectionCard>

      <CreateAccountModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editAccount && (
        <EditAccountModal account={editAccount} open={!!editAccount} onClose={() => setEditAccount(null)} />
      )}
      {deleteAccount && (
        <DeleteAccountDialog account={deleteAccount} open={!!deleteAccount} onClose={() => setDeleteAccount(null)} />
      )}
    </>
  );
}
