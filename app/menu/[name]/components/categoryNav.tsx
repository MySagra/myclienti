"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
  currentId: string;
}

export function CategoryNav({ categories, currentId }: CategoryNavProps) {
  const router = useRouter();
  const currentIndex = categories.findIndex((cat) => cat.id === currentId);

  const goPrev = () => {
    if (currentIndex > 0) {
      router.push(`/menu/${categories[currentIndex - 1].id}`);
    }
  };

  const goNext = () => {
    if (currentIndex < categories.length - 1) {
      router.push(`/menu/${categories[currentIndex + 1].id}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-0"
          aria-label="Categoria precedente"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <h1 className="text-3xl font-bold text-foreground">
          {categories[currentIndex]?.name}
        </h1>

        <button
          onClick={goNext}
          disabled={currentIndex >= categories.length - 1}
          className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-0"
          aria-label="Categoria successiva"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        {categories.map((cat, i) => {
          const isActive = i === currentIndex;
          return (
            <button
              key={`${cat.id}-${isActive ? "active" : "inactive"}-${currentId}`}
              onClick={() => router.push(`/menu/${cat.id}`)}
              className={`rounded-full ${
                isActive
                  ? "w-2 h-2 bg-primary"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              style={isActive ? { animation: "dotGrow 0.3s ease-out" } : undefined}
              aria-label={cat.name}
            />
          );
        })}
      </div>
    </div>
  );
}
