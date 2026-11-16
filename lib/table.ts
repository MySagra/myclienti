import { z } from 'zod'
import type { TableSettings } from '@/schemas/settings'

/** Value sent to the backend when the table is HIDDEN (kept for backend compatibility). */
export const NO_TABLE = 'NO_TABLE_PRESET'

const DEFAULT_MAX_TABLE = 9999
const MAX_TABLE_TEXT_LENGTH = 20
const NUMERIC_REGEX = /^\d+$/

/** Translation function (i18next `t`); on the server the default returns the key itself. */
export type Translate = (key: string, options?: Record<string, unknown>) => string
const keyOnly: Translate = (key) => key

/** i18n keys for label/placeholder and the keyboard for the table input, based on the allowed input types. */
export function tableFieldCopy(table: TableSettings) {
  const allowsNumber = table.inputs.includes('NUMBER')
  const allowsText = table.inputs.includes('TEXT')

  if (allowsNumber && !allowsText) {
    return { label: 'table.numberLabel', placeholder: 'table.numberPlaceholder', inputMode: 'numeric' as const }
  }
  if (allowsText && !allowsNumber) {
    return { label: 'table.textLabel', placeholder: 'table.textPlaceholder', inputMode: 'text' as const }
  }
  return { label: 'table.anyLabel', placeholder: 'table.anyPlaceholder', inputMode: 'text' as const }
}

/**
 * Validation for the table value according to the settings:
 *  - NUMBER only: digits only, between 1 and maxTables (or 9999)
 *  - TEXT only: free text, but not a plain number
 *  - NUMBER + TEXT: either; numeric values still respect maxTables
 */
export function tableValueSchema(table: TableSettings, t: Translate = keyOnly) {
  const allowsNumber = table.inputs.includes('NUMBER')
  const allowsText = table.inputs.includes('TEXT')
  const max = table.maxTables ?? DEFAULT_MAX_TABLE
  const requiredMsg = allowsNumber && !allowsText ? t('table.numberRequired') : t('table.required')

  return z
    .string()
    .trim()
    .min(1, requiredMsg)
    .max(MAX_TABLE_TEXT_LENGTH, t('table.tooLong', { max: MAX_TABLE_TEXT_LENGTH }))
    .superRefine((value, ctx) => {
      const isNumeric = NUMERIC_REGEX.test(value)

      if (!allowsText && !isNumeric) {
        ctx.addIssue({ code: 'custom', message: t('table.onlyNumbers') })
        return
      }
      if (!allowsNumber && isNumeric) {
        ctx.addIssue({ code: 'custom', message: t('table.notANumber') })
        return
      }
      if (isNumeric) {
        const n = parseInt(value, 10)
        if (n < 1) ctx.addIssue({ code: 'custom', message: t('table.min') })
        else if (n > max) ctx.addIssue({ code: 'custom', message: t('table.max', { max }) })
      }
    })
}
