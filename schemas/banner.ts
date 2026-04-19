import { z } from 'zod'

export const BannerTypeSchema = z.enum(["EVENT", "SPONSOR"])

export const BannerSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: BannerTypeSchema,
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  color: z.string(),
  dateTime: z.coerce.date().nullable().optional(),
  image: z.string().nullable().optional(),
})

export type Banner = z.infer<typeof BannerSchema>
