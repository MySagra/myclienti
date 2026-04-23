"use client"

import { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const hasIngredients = food.ingredients && food.ingredients.length > 0;
  const hasDescription = !!food.description;
  const isLongDesc = hasDescription && food.description!.length > 60;

  return <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
    <div className="mb-2 flex flex-col">
      <h3 className="font-semibold text-lg text-foreground truncate">{food.name}</h3>
      <div className="min-h-[1rem] mt-1 flex flex-col justify-start">
        {hasIngredients && (
          <p className="text-sm text-muted-foreground">
            Ingredienti: {food.ingredients!.map((i) => i.name).join(", ")}
          </p>
        )}
        {hasDescription && (
          <p className="text-sm text-muted-foreground">
            Descrizione: {isExpanded || !isLongDesc ? food.description : `${food.description!.slice(0, 60).trim()}`}
            {!isExpanded && isLongDesc && (
              <button
                onClick={() => setIsExpanded(true)}
                className="ml-1 text-primary hover:underline font-bold"
              >
                ...
              </button>
            )}
            {isExpanded && isLongDesc && (
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-1 text-primary hover:underline text-xs"
              >
                (riduci)
              </button>
            )}
          </p>
        )}
      </div>
    </div>

    <div className="flex justify-between items-center">
      <p className="text-primary font-bold text-lg">
        {Number(food.price).toFixed(2)}€
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