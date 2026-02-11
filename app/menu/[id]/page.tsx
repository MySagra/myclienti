import { FoodItemCard } from "./components/foodItemCard";
import Header from "@/components/Header";
import { getCategories } from "@/services/category.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartButton } from "./components/cartButton";

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const categories = await getCategories();
    const { id } = await params;

    const category = categories.find((cat) => cat.id === id);

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
        <div className="min-h-screen bg-background pb-24">
            <Header />

            <main className="container max-w-lg mx-auto px-4 py-6">
                <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Torna alle categorie
                </Link>

                <h1 className="text-2xl font-bold text-foreground mb-6">{category.name}</h1>

                <div className="space-y-3">
                    {
                        category.foods ?
                            category.foods.map((food) => (
                                <FoodItemCard key={food.id} food={food} />)) 
                            : 
                            <></>
                    }
                </div>
            </main>

            <CartButton />
        </div>
    );

}