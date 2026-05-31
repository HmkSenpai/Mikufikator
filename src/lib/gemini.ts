import { API_MODEL } from './constants'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

export class GeminiError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: (
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      )[]
    }
  }[]
}

export async function generateImage(
  imageBase64: string,
  prompt: string,
  onRetry?: (attempt: number, delay: number) => void,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new GeminiError(
      'Clé API manquante. Copiez .env.example en .env et ajoutez votre clé.',
    )
  }

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  }

  const delays = [1000, 2000, 4000, 8000, 16000]
  let attempt = 0

  while (true) {
    const response = await fetch(
      `${API_BASE}/${API_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )

    if (response.ok) {
      const result: GeminiResponse = await response.json()
      const data = result.candidates?.[0]?.content?.parts?.find(
        (p) => 'inlineData' in p,
      )?.inlineData?.data

      if (data) {
        return `data:image/png;base64,${data}`
      }

      const text = result.candidates?.[0]?.content?.parts?.find(
        (p) => 'text' in p,
      ) as { text: string } | undefined

      throw new GeminiError(
        text?.text || "L'IA n'a pas pu générer l'image. Réessayez.",
      )
    }

    if (attempt >= delays.length) {
      const body = await response.json().catch(() => null)
      throw new GeminiError(
        body?.error?.message || 'Erreur de connexion. Veuillez réessayer.',
        response.status,
      )
    }

    const delay = delays[attempt]
    onRetry?.(attempt + 1, delay)
    await new Promise((r) => setTimeout(r, delay))
    attempt++
  }
}
