"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, totalPrice, addItem, removeItem, clearItems } = useCart();
    const router = useRouter();

  const handleCheckout = () => {
    if (items.length > 0) {
      router.replace("/confirmation");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <main className="container max-w-lg mx-auto px-4 py-6">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continua ad ordinare
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Il tuo ordine</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={clearItems}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Svuota
          </Button>
        </div>

        <div className="space-y-3">
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
                    className="h-8 w-8 rounded-full"
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
                    className="h-8 w-8 rounded-full"
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

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
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
    </div>
  );
};