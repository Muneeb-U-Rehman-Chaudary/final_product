import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

const CheckoutClient = dynamic(() => import("./CheckoutClient"), {
  ssr: true,
});

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
