"use client"

import { Minus, Plus } from "lucide-react";
import { Food } from "@/schemas/food";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface FoodItemCardProps {
  food: Food;
}

export function FoodItemCard({ food }: FoodItemCardProps) {
  const {
    addItem,
    removeItem,
    getItemQuantity
  } = useCart();
  const quantity = getItemQuantity(food.id);

  return <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
      <div className="mb-2">
        <h3 className="font-semibold text-lg text-foreground">{food.name}</h3>
        {food.description && <p className="text-sm text-muted-foreground mt-1">
            {food.description}
          </p>}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-primary font-bold text-lg">
          {food.price}€
        </p>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => removeItem(food.id)} disabled={quantity === 0} className="h-9 w-9 rounded-lg">
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="w-8 text-center font-semibold text-lg">
            {quantity}
          </span>
          
          <Button variant="outline" size="icon" onClick={() => addItem(food)} className="h-9 w-9 rounded-lg">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>;
};