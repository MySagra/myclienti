"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"
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

export default function CartPage() {
  const { items, totalPrice, addItem, removeItem, clearItems } = useCart();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length > 0) {
      router.replace("/confirmation");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-dvh bg-background">
        <Header />
        <main className="container max-w-lg mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Il tuo carrello è vuoto</h1>
            <p className="text-muted-foreground mb-6">
              Aggiungi qualcosa di buono!
            </p>
            <Link href="/menu">
              <Button>Torna al menu</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-background">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Il tuo ordine</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Svuota
          </Button>
        </div>
        <Alert className="max-w-full mb-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
          <AlertTriangleIcon />
          <AlertTitle>Modifiche agli alimenti</AlertTitle>
          <AlertDescription>
            Per eventuali modifiche agli alimenti si prega di comunicarle in cassa.
            Ogni aggiunta comporterà un sovrapprezzo di 0,50€.
          </AlertDescription>
        </Alert>

        <div className="relative">
          <div className={`absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-background/80 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        <div
          className="flex-1 overflow-y-auto space-y-3 pb-4"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setIsScrolled(target.scrollTop > 0);
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg p-4 shadow-sm border border-border"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-primary font-bold">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => removeItem(item.id)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => addItem(item)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="shrink-0 bg-card border-t border-border p-4 shadow-lg">
        <div className="container max-w-lg mx-auto space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Totale</span>
            <span className="font-bold text-primary text-xl">
              {totalPrice.toFixed(2)}€
            </span>
          </div>
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={handleCheckout}
          >
            Conferma ordine
          </Button>
        </div>
      </div>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center">Svuotare il carrello?</AlertDialogTitle>
            <AlertDialogDescription className="text-left w-full">
              Tutti gli articoli nel carrello <strong>verranno rimossi</strong>.
              <br />
              Sei sicuro di voler continuare?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 sm:space-x-0">
            <AlertDialogCancel className="flex-1 mt-0 sm:mt-0">Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { clearItems(); setClearDialogOpen(false); }}
              className="flex-1"
              variant="destructive"
            >
              Svuota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};