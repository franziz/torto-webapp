"use client";

import { SWRConfig } from "swr";

type SWRProviderProps = {
  children: React.ReactNode;
};

export function SWRProvider(props: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          console.error("[SWR Error]", error);
        },
      }}
    >
      {props.children}
    </SWRConfig>
  );
}
