import z from "zod"

export const IngredientSchema = z.object({
    id: z.cuid(),
    name: z.string().min(1),
})

export type Ingredient = z.infer<typeof IngredientSchema>;