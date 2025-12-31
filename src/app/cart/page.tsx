"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/useSession";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Lock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import SafeImage from "@/components/SafeImage";
import Footer from "@/components/Footer";

export default function CartPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionPending } = useSession();
  const { cart, isLoading: cartLoading, removeFromCart } = useCart();

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.push("/login?redirect=/cart");
    }
  }, [session, sessionPending, router]);

  const handleRemoveItem = async (productId: number) => {
    removeFromCart.mutate(productId);
  };

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const productIds = cart.items.map((item: any) => item.productId).join(",");
    router.push(`/checkout?products=${productIds}`);
  };

  if (sessionPending || cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-[500px] w-full border rounded-3xl" />
              </div>
              <Skeleton className="h-[400px] w-full border rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.product?.price || 0);
  }, 0);
  const processingFee = 0;
  const tax = 0;
  const total = subtotal + processingFee + tax;

  return (
    <>
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-8 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 font-medium text-sm sm:text-base">
              Verify your selections before moving to checkout
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="border border-dashed border-gray-200 rounded-3xl py-20 sm:py-32 text-center space-y-6 sm:space-y-8">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto border border-gray-100">
                <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm sm:text-base">
                  Explore our collection to find premium digital assets.
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-xl font-semibold px-8 sm:px-10 h-12 sm:h-14 shadow-none"
                asChild
              >
                <Link href="/products">
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-gray-200 shadow-none rounded-2xl sm:rounded-[1.5rem] bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {items.map((item: any) => {
                        const product = item.product;
                        if (!product) return null;

                        const displayImage =
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400";

                        return (
                          <div
                            key={item.productId}
                            className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6"
                          >
                            {/* Image */}
                            <Link href={`/products/${item.productId}`}>
                              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl overflow-hidden hover:scale-105 transition-all bg-gray-50 border border-gray-100 flex-shrink-0">
                                <SafeImage
                                  src={displayImage}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <Link href={`/products/${item.productId}`}>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 sm:truncate hover:text-primary transition">
                                  {product.title}
                                </h3>
                              </Link>
                              <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
                                by{" "}
                                {product.vendor?.storeName || "Premium Vendor"}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-1 border-gray-100 text-gray-400 font-semibold px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.15em]"
                              >
                                {product.category?.replace("-", " ")}
                              </Badge>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex w-full sm:w-auto justify-between sm:justify-center items-center sm:items-end gap-3">
                              <span className="text-base sm:text-lg font-bold text-gray-900">
                                ${product.price?.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.productId)}
                                disabled={removeFromCart.isPending}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border border-gray-200 shadow-none rounded-2xl sm:rounded-[1.5rem] bg-white lg:sticky lg:top-24">
                  <div className="p-5 sm:p-6 border-b border-gray-100">
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-widest">
                      Order Summary
                    </h2>
                  </div>
                  <CardContent className="p-5 sm:p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-[13px] font-medium">
                        <span className="text-gray-400">Selected Assets</span>
                        <span className="text-gray-900">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-[13px] font-medium">
                        <span className="text-gray-400">Processing</span>
                        <span className="text-green-600 font-semibold">
                          Free
                        </span>
                      </div>
                      <Separator className="bg-gray-100 my-4" />
                      <div className="flex justify-between items-end">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          Total Investment
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-primary tracking-tighter">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 sm:h-14 rounded-xl font-semibold text-sm sm:text-base shadow-none"
                      onClick={handleCheckout}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Go to Checkout
                    </Button>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      {[
                        "Secure digital delivery",
                        "Protected payments",
                        "Expert support ready",
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
