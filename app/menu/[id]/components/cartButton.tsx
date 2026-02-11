"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext";

export function CartButton() {
    const { totalItems, totalPrice } = useCart();
    
    if (totalItems === 0) {
        return <></>
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3">
            <div className="container max-w-lg mx-auto">
                <Link href="/cart">
                    <Button className="w-full h-12 justify-between px-6">
                        <span>Vai al carrello</span>
                        <span className="font-bold">{totalPrice.toFixed(2)}€</span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}