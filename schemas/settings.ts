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

export interface ClientSettings {
  timezone: string
  currency: string
  ordering: {
    mode: OrderingMode
    opensAt: string | null
    closesAt: string | null
  }
}

export const DEFAULT_CLIENT_SETTINGS: ClientSettings = {
  timezone: 'Europe/Rome',
  currency: 'EUR',
  ordering: { mode: 'OPEN', opensAt: null, closesAt: null },
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
  }
}
