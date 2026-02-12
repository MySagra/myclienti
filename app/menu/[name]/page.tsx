import { CategoryView } from "./components/categoryView";
import Header from "@/components/Header";
import { getCategories } from "@/services/category.service";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: Promise<{ name: string }> }) {
    const categories = await getCategories();
    const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const category = sortedCategories.find((cat) => cat.name === decodedName);

    if (!category) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Categoria non trovata</h1>
                    <Link href="/menu" className="text-primary underline">
                        Torna al menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
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