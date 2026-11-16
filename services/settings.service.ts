import {
  ClientSettings,
  DEFAULT_CLIENT_SETTINGS,
  SettingsSchema,
  toClientSettings,
} from '@/schemas/settings'

/**
 * Fetches the centralized settings from the backend (/v1/settings).
 * Falls back to defaults if the backend is unreachable or the payload is invalid,
 * so the app keeps working (the backend still enforces its own rules on order creation).
 */
export async function getSettings(): Promise<ClientSettings> {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/settings`, {
      next: { tags: ['settings'], revalidate: 30 },
      headers: {
        'X-API-KEY': process.env.CLIENTI_API_KEY ?? '',
      },
    })

    if (!res.ok) {
      console.error(`Failed to fetch settings: ${res.status}`)
      return DEFAULT_CLIENT_SETTINGS
    }

    const parsed = SettingsSchema.safeParse(await res.json())
    if (!parsed.success) {
      console.error('Invalid settings payload:', parsed.error.issues)
      return DEFAULT_CLIENT_SETTINGS
    }

    return toClientSettings(parsed.data)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return DEFAULT_CLIENT_SETTINGS
  }
}
