"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Menu, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const footerLinks = {
    Products: [
      { name: "WordPress Themes", href: "/products?category=wordpress-theme" },
      { name: "Plugins", href: "/products?category=plugin" },
      { name: "Templates", href: "/products?category=template" },
      { name: "UI Kits", href: "/products?category=ui-kit" },
    ],
    Company: [
      { name: "Browse Products", href: "/products" },
      { name: "Our Vendors", href: "/vendors" },
      { name: "Become a Vendor", href: "/vendor-signup" },
      { name: "Vendor Analytics", href: "/vendor/analytics" },
      { name: "Sponsorships", href: "/vendor/sponsorship" },
    ],
    Account: [
      { name: "User Dashboard", href: "/dashboard" },
      { name: "My Orders", href: "/orders" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Checkout", href: "/checkout" },
      { name: "Notifications", href: "/notifications" },
    ],
  };

  // Animate drawer after open
  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimate(true), 10); // small delay to trigger transition
    } else {
      setAnimate(false);
    }
  }, [open]);

  return (
    <footer className="border-t border-border/40 bg-background relative">
      {/* MOBILE HEADER */}
      <div className="sm:hidden flex justify-between items-center px-4 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Package className="h-6 w-6 text-primary" /> DigiVerse
        </div>
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* DESKTOP FOOTER */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-12 px-4 py-10 container mx-auto">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold tracking-tighter text-primary">
              DigiVerse
            </span>
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed max-w-[200px]">
            Your trusted marketplace for premium digital products.
          </p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="space-y-6">
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* MOBILE BOTTOM DRAWER */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div
        className={`
          fixed bottom-0 left-0 w-full h-[90vh] bg-background rounded-t-2xl z-50
          transform transition-transform duration-300 ease-out
          ${animate ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Package className="h-6 w-6 text-primary" /> DigiVerse
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Links */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto h-[calc(90vh-72px)]">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-2">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary font-medium block"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <p className="text-sm font-medium text-muted-foreground/60 mt-6 text-center">
          © 2024 DigiVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
