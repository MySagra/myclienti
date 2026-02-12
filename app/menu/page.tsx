import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/services/category.service";

export const dynamic = 'force-dynamic';

export default async function Menu() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto scrollbar-hide relative">
        <div className="container max-w-lg mx-auto px-4 py-6">
          <MenuList />
        </div>

        {/* Bottom fade shadow */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent pointer-events-none" />
      </main>
    </div>
  );
}
async function MenuList() {
  const categories = await getCategories();
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <div className="grid gap-4 pb-8">
      {sortedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
