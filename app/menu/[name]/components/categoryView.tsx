"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FoodItemCard } from "./foodItemCard";
import { Category } from "@/schemas/category";

interface CategoryViewProps {
  categories: Category[];
  initialName: string;
}

export function CategoryView({ categories, initialName }: CategoryViewProps) {
  const initialIndex = categories.findIndex((cat) => cat.name === initialName);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const category = categories[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= categories.length || isAnimating) return;
      setDirection(index > currentIndex ? "right" : "left");
      setIsAnimating(true);
      setCurrentIndex(index);
    },
    [currentIndex, categories.length, isAnimating]
  );

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Update URL without navigation
  useEffect(() => {
    const newUrl = `/menu/${encodeURIComponent(categories[currentIndex].name)}`;
    window.history.replaceState(null, "", newUrl);
  }, [currentIndex, categories]);

  // Swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const getAnimationClass = () => {
    if (!isAnimating || !direction) return "animate-none";
    return direction === "right"
      ? "animate-[slideInRight_0.3s_ease-out]"
      : "animate-[slideInLeft_0.3s_ease-out]";
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col h-[calc(100vh-4rem)]"
    >
      {/* Fixed category navigation */}
      <div className="flex flex-col items-center gap-2 pt-6 pb-4 bg-background relative z-10">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={goPrev}
            disabled={currentIndex <= 0 || isAnimating}
            className={`p-2 rounded-full hover:bg-muted transition-colors ${currentIndex <= 0 ? "invisible" : ""}`}
            aria-label="Categoria precedente"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          <h1
            key={currentIndex}
            className="text-3xl font-bold text-foreground"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            {category.name}
          </h1>

          <button
            onClick={goNext}
            disabled={currentIndex >= categories.length - 1 || isAnimating}
            className={`p-2 rounded-full hover:bg-muted transition-colors ${currentIndex >= categories.length - 1 ? "invisible" : ""}`}
            aria-label="Categoria successiva"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: i === currentIndex ? 8 : 6,
                height: i === currentIndex ? 8 : 6,
                backgroundColor:
                  i === currentIndex
                    ? "var(--primary)"
                    : "color-mix(in srgb, var(--muted-foreground) 30%, transparent)",
              }}
              aria-label={cat.name}
            />
          ))}
        </div>

        {/* Shadow under category nav */}
        <div className="absolute bottom-0 left-0 right-0 h-4 translate-y-full bg-linear-to-b from-background/80 to-transparent pointer-events-none" />
      </div>

      {/* Scrollable food items */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto pb-24"
      >
        <div
          key={currentIndex}
          className="space-y-3 pt-2"
          style={{
            animation: direction
              ? `${direction === "right" ? "slideInRight" : "slideInLeft"} 0.3s ease-out`
              : undefined,
          }}
        >
          {category.foods
            ? category.foods.map((food) => (
                <FoodItemCard key={food.id} food={food} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
