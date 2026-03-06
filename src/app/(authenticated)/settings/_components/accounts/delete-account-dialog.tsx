"use client";

import { Modal } from "@/core/presentations/components/modal";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useDeleteAccount } from "@/features/account/presentation/hooks/use-delete-account";
import { DeleteAccountUseCaseParams } from "@/features/account/domain/usecases/delete-account.usecases";
import { AccountEntity } from "@/features/account/domain/entities/account";

type DeleteAccountDialogProps = {
  account: AccountEntity;
  open: boolean;
  onClose: () => void;
};

export function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const { trigger, loading } = useDeleteAccount();

  const handleDelete = async () => {
    await trigger(new DeleteAccountUseCaseParams({ id: props.account.id }));
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose} title="Delete Account">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <span className="font-semibold">{props.account.name}</span>? This action cannot
        be undone.
      </p>
      <div className="mt-4 flex gap-x-3">
        <OutlinedButton type="button" onClick={props.onClose}>
          Cancel
        </OutlinedButton>
        <FilledButton type="button" color="danger" loading={loading} onClick={handleDelete}>
          Delete
        </FilledButton>
      </div>
    </Modal>
  );
}
