"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useIsMobile } from "@/core/presentations/hooks/use-is-mobile";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "lg" | "xl";
};

export function Modal(props: ModalProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={props.open} onClose={props.onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className={`fixed inset-0 z-50 w-screen ${isMobile ? "flex items-end" : "overflow-y-auto"}`}>
        {isMobile ? (
          <DialogPanel className="relative w-full max-h-[80vh] transform overflow-y-auto rounded-t-2xl bg-white px-4 pt-3 pb-4 text-left shadow-xl transition-all data-[closed]:translate-y-full">
            <div className="mb-3 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-gray-300" />
            </div>
            <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
              {props.title}
            </DialogTitle>
            <div className="mt-4 pb-safe">{props.children}</div>
          </DialogPanel>
        ) : (
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              className={`relative w-full ${props.size === "xl" ? "max-w-2xl" : "max-w-lg"} transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6`}
            >
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                {props.title}
              </DialogTitle>
              <div className="mt-4">{props.children}</div>
            </DialogPanel>
          </div>
        )}
      </div>
    </Dialog>
  );
}
