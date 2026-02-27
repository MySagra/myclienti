"use client";

import Link from "next/link";
import { ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Header = () => {
  const { totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    clearCart();
    sessionStorage.removeItem("mysagra-cart");
    router.push("/");
  };

  return (
    <>
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

            <div className="absolute right-0 flex items-center gap-2">
              <Link
                href="/cart"
                className="flex items-center gap-2"
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

              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-destructive/20 transition-colors"
                title="Esci dalla sessione"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </button>
            </div>

          </nav>
        </div>
      </header>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center">Uscire dalla sessione?</AlertDialogTitle>
            <AlertDialogDescription className="text-left w-full">
              Tutti i progressi compiuti nell'ordine <strong>verranno persi</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 sm:space-x-0">
            <AlertDialogCancel className="flex-1 mt-0 sm:mt-0">Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="flex-1"
              variant="destructive"
            >
              Esci
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;
