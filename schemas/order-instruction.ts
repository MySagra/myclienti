import { z } from 'zod'

export const OrderInstructionSchema = z.object({
  id: z.string(),
  text: z.string(),
  position: z.number(),
})

export type OrderInstruction = z.infer<typeof OrderInstructionSchema>
