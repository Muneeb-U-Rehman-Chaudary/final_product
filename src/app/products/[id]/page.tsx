"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import {
  Star,
  ShoppingCart,
  Download,
  Package,
  Check,
  ExternalLink,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Shield,
  RefreshCw,
  FileCode,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProduct, useCreateReview } from "@/hooks/useApi";
import { useCart } from "@/hooks/useCart";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;

  const { data: productData, isLoading: loading } = useProduct(id);
  const { addToCart } = useCart();
  const createReview = useCreateReview();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const product = productData?.product;

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast.error("Please sign in to add items to cart");
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    addToCart.mutate(product.productId);
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      toast.error("Please sign in to purchase");
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    router.push(`/checkout?products=${product.productId}`);
  };

  const handleSubmitReview = async () => {
    if (!session?.user) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    createReview.mutate(
      {
        productId: product.productId,
        rating: reviewRating,
        comment: reviewComment,
      },
      {
        onSuccess: () => {
          setReviewComment("");
          setReviewRating(5);
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images =
    typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;
  const tags = product.tags
    ? typeof product.tags === "string"
      ? JSON.parse(product.tags)
      : product.tags
    : [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <div className="text-xs sm:text-sm text-muted-foreground mb-4 flex flex-wrap gap-1 min-w-0">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-full">
            {product.title}
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 min-w-0">
          {/* LEFT — IMAGES */}
          <div className="space-y-4 min-w-0">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <SafeImage
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                loading="lazy"
              />

              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3"
                onClick={() => setIsZoomed(true)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded overflow-hidden border ${
                      selectedImage === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent"
                    }`}
                  >
                    <SafeImage src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — DETAILS */}
          <div className="space-y-6 min-w-0">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="capitalize">
                  {product.category.replace("-", " ")}
                </Badge>
                {product.featured && (
                  <Badge className="gradient-bg">Featured</Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {product.rating?.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>

            <p className="text-muted-foreground break-words leading-relaxed">
              {product.description}
            </p>

            {/* Vendor */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={product.vendor?.image} />
                    <AvatarFallback>
                      {product.vendor?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {product.vendor?.storeName || product.vendor?.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      ⭐ {product.vendor?.rating?.toFixed(1)} •{" "}
                      {product.vendor?.totalSales} sales
                    </p>
                  </div>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/vendors/${product.vendorId}`}>
                      View Store
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PRICE + CTA */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold gradient-text">
                  ${product.price?.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  One-time payment
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 gradient-bg py-4 sm:py-5 text-base font-semibold"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 py-4 sm:py-5 text-base font-semibold"
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addToCart.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.totalReviews})
            </TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>

          {/* DESCRIPTION */}
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6 prose prose-sm max-w-none break-words">
                {product.description}
              </CardContent>
            </Card>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="reviews" className="mt-6 space-y-6">
            {/* Review Form */}
            {session?.user && (
              <Card className="border-border/50 shadow-none rounded-[2rem] bg-muted/20">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">
                    Share your experience
                  </h3>
                  <div className="space-y-3">
                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Experience Rating
                    </Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="review"
                      className="font-bold text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Detailed Feedback
                    </Label>
                    <Textarea
                      id="review"
                      placeholder="What did you think of this asset?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={5}
                      className="rounded-2xl border-border/50 focus:ring-primary/10 font-medium p-4 shadow-none"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={createReview.isPending}
                    className="rounded-xl px-8 h-12 font-bold shadow-none"
                  >
                    {createReview.isPending ? "Sharing..." : "Post Review"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Existing Reviews */}
            <div className="space-y-4">
              {product.reviews?.length ? (
                product.reviews.map((review: any) => (
                  <Card
                    key={review.reviewId}
                    className="border-border/50 shadow-none rounded-[2rem] bg-muted/20"
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={review.customer?.image} />
                          <AvatarFallback>
                            {review.customer?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {review.customer?.name}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet.
                </p>
              )}
            </div>
          </TabsContent>

          {/* CHANGELOG */}
          <TabsContent value="changelog" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {product.changelog ? (
                  <pre className="whitespace-pre-wrap text-sm">
                    {product.changelog}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No changelog available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* IMAGE ZOOM — SCROLL SAFE */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed} modal={false}>
        <DialogContent
          className="max-w-[95vw] max-h-[90vh] overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="relative aspect-square w-full">
            <SafeImage
              src={images[selectedImage]}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
