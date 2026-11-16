import type { ClientSettings } from '@/schemas/settings'

export type OrderingStatus =
  | { canSend: true; reason: 'OPEN' }
  | { canSend: false; reason: 'CLOSED' }
  | { canSend: false; reason: 'OUTSIDE_SCHEDULE'; opensAt: string; closesAt: string }

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Current minutes since midnight in the given IANA timezone. */
function minutesInTimezone(date: Date, timeZone: string): number {
  let parts: Intl.DateTimeFormatPart[]
  try {
    parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date)
  } catch {
    // Invalid timezone: fall back to the runtime's local time
    return date.getHours() * 60 + date.getMinutes()
  }
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return (hour % 24) * 60 + minute
}

/**
 * Whether the customer can send an order right now.
 * A schedule whose closesAt is earlier than opensAt crosses midnight (e.g. 19:30 → 00:01).
 */
export function getOrderingStatus(settings: ClientSettings, now: Date = new Date()): OrderingStatus {
  const { mode, opensAt, closesAt } = settings.ordering

  if (mode === 'CLOSED') return { canSend: false, reason: 'CLOSED' }
  if (mode === 'OPEN' || !opensAt || !closesAt) return { canSend: true, reason: 'OPEN' }

  const current = minutesInTimezone(now, settings.timezone)
  const open = toMinutes(opensAt)
  const close = toMinutes(closesAt)

  let isOpen: boolean
  if (open === close) isOpen = true
  else if (open < close) isOpen = current >= open && current < close
  else isOpen = current >= open || current < close

  return isOpen
    ? { canSend: true, reason: 'OPEN' }
    : { canSend: false, reason: 'OUTSIDE_SCHEDULE', opensAt, closesAt }
}

export function formatPrice(value: number, currency: string, locale = 'it-IT'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}
