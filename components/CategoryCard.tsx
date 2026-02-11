import Link from "next/link";
import { Category } from "@/schemas/category";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/menu/${category.id}`} className="block group">
      <div className="bg-card rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="h-32 bg-muted overflow-hidden">
          {category.image ? (
            <img
              src={`/api/proxy/uploads/category-images/${category.image}`}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Nessuna immagine
            </div>
          )}
        </div>
        <div className="bg-primary py-3 px-4">
          <h3 className="text-primary-foreground font-semibold text-center uppercase tracking-wide">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
