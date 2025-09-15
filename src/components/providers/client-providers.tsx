// components/providers/client-providers.tsx
"use client";

import { ModalProvider } from "@/components/modals/modal-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ModalProvider />
    </>
  );
}