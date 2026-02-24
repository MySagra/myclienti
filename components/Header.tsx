"use client";

import Link from "next/link";
import { ShoppingCart, House } from "lucide-react";
import { useCart } from "@/context/CartContext";


const Header = () => {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-card border-b border-border">
      <div className="container max-w-lg mx-auto px-4">
        <nav className="relative flex items-center justify-between py-3">

          <Link href="/menu" className="font-bold flex items-center gap-2 text-primary">
            <img
              src="/logo.svg"
              alt="Logo"
              className="mx-auto h-8 w-auto select-none"
            />
            MySagra
          </Link>

          <Link
            href="/cart"
            className="absolute right-0 flex items-center gap-2"
          >
            {totalPrice > 0 && (
              <span className="text-sm font-bold text-foreground">
                {totalPrice.toFixed(2)}€
              </span>
            )}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
