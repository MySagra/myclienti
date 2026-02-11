import z from "zod"

import { FoodSchema } from "@/schemas/food";

export const CategorySchema = z.object({
    id: z.cuid(),
    name: z.string().min(1),
    available: z.boolean(),
    position: z.number().int(),
    printerId: z.cuid().nullish(),
    image: z.url().nullish(),
    foods: z.array(FoodSchema).optional()
})

export type Category = z.infer<typeof CategorySchema>