import { z } from 'zod'
import { OrderInstruction, OrderInstructionSchema } from '@/schemas/order-instruction'

export async function getOrderInstructions(): Promise<OrderInstruction[]> {
  let res: Response

  try {
    res = await fetch(`${process.env.API_URL}/v1/order-instructions`, {
      next: { tags: ['order-instructions'], revalidate: 60 },
      headers: {
        'X-API-KEY': process.env.CLIENTI_API_KEY ?? '',
      },
    })
  } catch {
    return []
  }

  if (!res.ok) {
    return []
  }

  const data = await res.json()
  const instructions = z.array(OrderInstructionSchema).parse(data)
  return instructions.sort((a, b) => a.position - b.position)
}
