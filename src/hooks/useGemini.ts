import { useState, useCallback, useRef } from 'react'
import { generateImage, GeminiError } from '../lib/gemini'
import type { Status } from '../types'

export function useGemini() {
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const abortRef = useRef(false)

  const run = useCallback(
    async (imageBase64: string, prompt: string) => {
      abortRef.current = false
      setStatus('loading')
      setError(null)
      setResult(null)
      setRetryAttempt(0)

      try {
        const data = await generateImage(imageBase64, prompt, (attempt) => {
          if (!abortRef.current) setRetryAttempt(attempt)
        })
        if (!abortRef.current) {
          setResult(data)
          setStatus('success')
        }
      } catch (err) {
        if (!abortRef.current) {
          const msg =
            err instanceof GeminiError
              ? err.message
              : 'Une erreur est survenue. Veuillez réessayer.'
          setError(msg)
          setStatus('error')
        }
      }
    },
    [],
  )

  const reset = useCallback(() => {
    abortRef.current = true
    setStatus('idle')
    setResult(null)
    setError(null)
    setRetryAttempt(0)
  }, [])

  return { status, result, error, retryAttempt, run, reset }
}
