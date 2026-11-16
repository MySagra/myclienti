import { z } from 'zod'

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/**
 * Ordering mode:
 *  - OPEN: orders can always be sent
 *  - SCHEDULE: orders can be composed anytime but sent only between opensAt and closesAt
 *  - CLOSED: orders cannot be sent from the customer web app
 */
export const OrderingModeSchema = z.preprocess(
  (v) => (v === 'SCHEDULED' ? 'SCHEDULE' : v),
  z.enum(['OPEN', 'SCHEDULE', 'CLOSED'])
)

/** REQUIRED / OPTIONAL / HIDDEN. The customer app treats OPTIONAL as REQUIRED. */
export const FieldModeSchema = z.enum(['REQUIRED', 'OPTIONAL', 'HIDDEN'])
export const TableInputSchema = z.enum(['NUMBER', 'TEXT'])

export const SettingsSchema = z.object({
  sagra: z
    .object({
      name: z.string().nullable().optional(),
    })
    .passthrough()
    .optional(),
  settings: z
    .object({
      general: z
        .object({
          timezone: z.string().refine(isValidTimezone).catch('Europe/Rome').default('Europe/Rome'),
          currency: z.string().catch('EUR').default('EUR'),
        })
        .passthrough()
        .default({ timezone: 'Europe/Rome', currency: 'EUR' }),
      orders: z
        .object({
          customer: FieldModeSchema.catch('REQUIRED').default('REQUIRED'),
          table: FieldModeSchema.catch('REQUIRED').default('REQUIRED'),
          tableInputs: z
            .array(z.string())
            .transform((arr) => {
              const valid = TableInputSchema.options.filter((o) => arr.includes(o))
              return valid.length > 0 ? valid : (['NUMBER'] as TableInput[])
            })
            .catch(['NUMBER'])
            .default(['NUMBER']),
          maxTables: z.number().int().positive().nullable().catch(null).default(null),
        })
        .passthrough()
        .default({ customer: 'REQUIRED', table: 'REQUIRED', tableInputs: ['NUMBER'], maxTables: null }),
      ordering: z
        .object({
          mode: OrderingModeSchema.catch('OPEN').default('OPEN'),
          opensAt: z.string().regex(TIME_REGEX).nullable().catch(null).default(null),
          closesAt: z.string().regex(TIME_REGEX).nullable().catch(null).default(null),
        })
        .passthrough()
        .default({ mode: 'OPEN', opensAt: null, closesAt: null }),
    })
    .passthrough(),
  updatedAt: z.string().nullable().optional(),
})

export type Settings = z.infer<typeof SettingsSchema>
export type OrderingMode = z.infer<typeof OrderingModeSchema>
export type TableInput = z.infer<typeof TableInputSchema>

export interface TableSettings {
  /** false when the table is HIDDEN; REQUIRED and OPTIONAL both require it */
  enabled: boolean
  inputs: TableInput[]
  maxTables: number | null
}

export interface ClientSettings {
  timezone: string
  currency: string
  ordering: {
    mode: OrderingMode
    opensAt: string | null
    closesAt: string | null
  }
  table: TableSettings
}

export const DEFAULT_CLIENT_SETTINGS: ClientSettings = {
  timezone: 'Europe/Rome',
  currency: 'EUR',
  ordering: { mode: 'OPEN', opensAt: null, closesAt: null },
  table: { enabled: true, inputs: ['NUMBER'], maxTables: null },
}

export function toClientSettings(s: Settings): ClientSettings {
  return {
    timezone: s.settings.general.timezone,
    currency: s.settings.general.currency,
    ordering: {
      mode: s.settings.ordering.mode,
      opensAt: s.settings.ordering.opensAt,
      closesAt: s.settings.ordering.closesAt,
    },
    table: {
      enabled: s.settings.orders.table !== 'HIDDEN',
      inputs: s.settings.orders.tableInputs,
      maxTables: s.settings.orders.maxTables,
    },
  }
}
