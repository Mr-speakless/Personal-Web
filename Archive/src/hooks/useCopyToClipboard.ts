import { useCallback, useState } from 'react'

const RESET_DELAY_MS = 2000

export function useCopyToClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)

      window.setTimeout(() => {
        setCopiedValue((current) => (current === value ? null : current))
      }, RESET_DELAY_MS)

      return true
    } catch {
      setCopiedValue(null)
      return false
    }
  }, [])

  return { copiedValue, copy }
}
