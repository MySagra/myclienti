import { z } from 'zod'
import type { TableSettings } from '@/schemas/settings'

/** Value sent to the backend when the table is HIDDEN (kept for backend compatibility). */
export const NO_TABLE = 'NO_TABLE_PRESET'

const DEFAULT_MAX_TABLE = 9999
const MAX_TABLE_TEXT_LENGTH = 20
const NUMERIC_REGEX = /^\d+$/

/** Label/placeholder/keyboard for the table input, based on the allowed input types. */
export function tableFieldCopy(table: TableSettings) {
  const allowsNumber = table.inputs.includes('NUMBER')
  const allowsText = table.inputs.includes('TEXT')

  if (allowsNumber && !allowsText) {
    return { label: 'Numero tavolo', placeholder: 'Numero tavolo', inputMode: 'numeric' as const }
  }
  if (allowsText && !allowsNumber) {
    return { label: 'Nome tavolo', placeholder: 'Es. Terrazza', inputMode: 'text' as const }
  }
  return { label: 'Tavolo', placeholder: 'Numero o nome tavolo', inputMode: 'text' as const }
}

/**
 * Validation for the table value according to the settings:
 *  - NUMBER only: digits only, between 1 and maxTables (or 9999)
 *  - TEXT only: free text, but not a plain number
 *  - NUMBER + TEXT: either; numeric values still respect maxTables
 */
export function tableValueSchema(table: TableSettings) {
  const allowsNumber = table.inputs.includes('NUMBER')
  const allowsText = table.inputs.includes('TEXT')
  const max = table.maxTables ?? DEFAULT_MAX_TABLE
  const requiredMsg = allowsNumber && !allowsText ? 'Numero tavolo obbligatorio' : 'Tavolo obbligatorio'

  return z
    .string()
    .trim()
    .min(1, requiredMsg)
    .max(MAX_TABLE_TEXT_LENGTH, `Il tavolo non può superare ${MAX_TABLE_TEXT_LENGTH} caratteri`)
    .superRefine((value, ctx) => {
      const isNumeric = NUMERIC_REGEX.test(value)

      if (!allowsText && !isNumeric) {
        ctx.addIssue({ code: 'custom', message: 'Inserisci solo numeri' })
        return
      }
      if (!allowsNumber && isNumeric) {
        ctx.addIssue({ code: 'custom', message: 'Inserisci il nome del tavolo, non un numero' })
        return
      }
      if (isNumeric) {
        const n = parseInt(value, 10)
        if (n < 1) ctx.addIssue({ code: 'custom', message: 'Il tavolo deve essere almeno 1' })
        else if (n > max) ctx.addIssue({ code: 'custom', message: `Il tavolo non può superare ${max}` })
      }
    })
}
