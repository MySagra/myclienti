"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardList } from "lucide-react";
import { OrderLoading } from "./components/orderLoading";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ConfirmationPage = () => {
  const { items, totalPrice, clearItems, clearCart, name, tableNumber, displayCode, setDisplayCode, isHydrated } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (displayCode) return;

    const orderItems = items.map(item => ({
      foodId: item.id,
      quantity: item.quantity
    }));

    const body = {
      customer: name,
      table: tableNumber,
      orderItems: orderItems
    }

    fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      if (!res.ok) {
        console.error("Failed to create order:", await res.json());
      } else {
        const data = await res.json();
        setDisplayCode(data.displayCode);
      }
    });
  }, [])

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/menu");
    }
  }, [isHydrated, items.length]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleNewOrder = () => {
    // Save user info before clearing for login form precompilation
    sessionStorage.setItem("mysagra-user", JSON.stringify({ name, tableNumber }));
    // Remove cart storage to prevent redirect issues
    sessionStorage.removeItem("mysagra-cart");
    clearCart();
    router.replace("/");
  };

  if (!isHydrated || items.length === 0) {
    return null;
  }

  if (!displayCode) {
    return (
      <div className="h-screen flex items-center place-content-center">
        <OrderLoading />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-primary mb-6" />

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Questo è il tuo codice ordine,
        </h1>
        <p className="text-xl font-bold text-foreground mb-8">
          non dimenticarlo:
        </p>

        <div className="text-8xl font-black text-primary mb-8 tracking-wider font-mono">
          {displayCode}
        </div>

        <div className="mb-8">
          <p className="text-2xl font-bold text-foreground mb-2">
            Devi pagare {totalPrice.toFixed(2)}€
          </p>
          <p className="text-muted-foreground text-sm">
            *Prepara i soldi per velocizzare il processo 😁
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 mb-8 text-left shadow-sm border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">
            Cosa devo fare ora?
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-xl">👉</span>
              <span className="text-foreground">
                Vai in cassa e comunica il tuo codice ordine
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">💰</span>
              <span className="text-foreground">
                Effettua il pagamento alla cassa
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🥤</span>
              <span className="text-foreground">
                Dopo aver pagato, ritira le tue bevande al bar
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">📢</span>
              <span className="text-foreground">
                Quando l'ordine sarà pronto, verrai chiamato con il codice ordine oppure il numero sullo scontrino
              </span>
            </li>
          </ul>
        </div>

        <Button
          className="w-full h-14 text-lg font-semibold"
          onClick={handleNewOrder}
        >
          Crea un nuovo ordine
        </Button>

        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium mt-3"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Vedi riepilogo ordine
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center text-xl">Riepilogo ordine</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <span className="text-lg font-bold">Totale</span>
                <span className="text-lg font-bold text-primary">{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ConfirmationPage;
