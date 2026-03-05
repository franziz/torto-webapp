import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SWRProvider } from "@/core/presentations/providers/swr-provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "torto-webapp",
  description: "A Next.js application with Clean Architecture",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html className="scrollbar-hide h-full" lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="h-full">
          <SWRProvider>{children}</SWRProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
