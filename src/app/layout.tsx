import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import { ClientWrapper } from "@/components/ClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DigiVerse - Premium Digital Marketplace",
  description: "Discover high-quality WordPress themes, plugins, templates, and digital designs from top vendors worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="3cc5654b-71f4-4824-aa21-e44da85ccea6"
        />
        <Script
          id="route-messenger"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "DigiVerse", "version": "1.0.0", "greeting": "hi"}'
        />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
