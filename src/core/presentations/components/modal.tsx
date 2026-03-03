"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal(props: ModalProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-lg transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6">
            <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
              {props.title}
            </DialogTitle>
            <div className="mt-4">{props.children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
