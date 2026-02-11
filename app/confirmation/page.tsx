"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { OrderLoading } from "./components/orderLoading";

const ConfirmationPage = () => {
  const { items, totalPrice, clearItems, name, tableNumber, displayCode, setDisplayCode, isHydrated } = useCart();
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
    clearItems();
    setDisplayCode("");
    router.push("/menu");
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
      </div>
    </div>
  );
};

export default ConfirmationPage;
