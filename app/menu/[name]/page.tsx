import { CategoryView } from "./components/categoryView";
import Header from "@/components/Header";
import { getCategories } from "@/services/category.service";
import { CategoryNotFound } from "./components/categoryNotFound";

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: Promise<{ name: string }> }) {
    const categories = await getCategories();
    const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const category = sortedCategories.find((cat) => cat.name === decodedName);

    if (!category) {
        return <CategoryNotFound />;
    }

    return (
        <div className="h-dvh flex flex-col bg-background overflow-hidden">
            <Header />

            <main className="flex-1 min-h-0 container max-w-lg mx-auto px-4 w-full">
                <CategoryView
                    categories={sortedCategories}
                    initialName={decodedName}
                />
            </main>
        </div>
    );

}