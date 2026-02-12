import z from "zod"

export const OrderItemInputSchema = z.object({
    foodId: z.cuid(),
    quantity: z.number().int().min(1),
    notes: z.string().optional()
});

export const CreateOrderSchema = z.object({
    table: z.string().min(1),
    customer: z.string().min(1),
    orderItems: z.array(OrderItemInputSchema).min(1)
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>