import z from "zod"
import { IngredientSchema } from "@/schemas/ingredient";

export const FoodSchema = z.object({
    id: z.cuid(),
    name: z.string().min(1),
    description: z.string().min(0).nullish(),
    price: z.number().min(0.01),
    available: z.boolean(),
    categoryId: z.cuid(),
    printerId: z.cuid().nullish().optional(),
    ingredients: z.array(IngredientSchema).nullish()
})

export type Food = z.infer<typeof FoodSchema>;