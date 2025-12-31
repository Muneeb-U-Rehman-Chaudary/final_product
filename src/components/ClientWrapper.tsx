"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { SessionProvider } from "@/contexts/SessionContext";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Cart } from "@/components/Cart";
import ErrorReporter from "@/components/ErrorReporter";

export function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Trigger loader on path change
  useEffect(() => {
    if (!pathname) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400); // show loader for 400ms
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <QueryProvider>
      <ReduxProvider>
        <SessionProvider>
          <ErrorReporter />
          <NextTopLoader
            color="var(--primary)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={5}
            crawl
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--primary), 0 0 5px var(--primary)"
          />

          <Cart />
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </ReduxProvider>
    </QueryProvider>
  );
}
