const SPACE_HOST = 'https://onise-qwen-image-edit-2509-loras-fast2.hf.space'

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function generateImage(
  imageBase64: string,
  prompt: string,
  onRetry?: (attempt: number, delay: number) => void,
): Promise<string> {
  const delays = [8000, 15000, 30000, 60000]
  let attempt = 0

  while (true) {
    try {
      const imgBlob = await (await fetch(imageBase64)).blob()

      const uploadForm = new FormData()
      uploadForm.append('files', imgBlob, 'image.jpg')

      const uploadRes = await fetch(`${SPACE_HOST}/gradio_api/upload`, {
        method: 'POST',
        body: uploadForm,
      })

      if (!uploadRes.ok) {
        const body = await uploadRes.text().catch(() => '')
        throw new ApiError(`Upload: ${uploadRes.status}`, uploadRes.status)
      }

      const uploaded: { url: string }[] = await uploadRes.json()
      const fileRef = { path: SPACE_HOST + uploaded[0].url }

      const inferRes = await fetch(`${SPACE_HOST}/gradio_api/call/infer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            fileRef,
            prompt,
            0,
            true,
            1.0,
            4,
            'worst quality, low quality, bad anatomy, text, watermark',
            null, 1.0,
            null, 1.0,
            null, 1.0,
            null, 1.0,
            null, 1.0,
            null, 1.0,
          ],
        }),
      })

      if (!inferRes.ok) {
        const body = await inferRes.text().catch(() => '')
        const is503 = inferRes.status === 503
        throw new ApiError(
          is503 ? 'Le GPU demarre' : `Erreur ${inferRes.status}`,
          is503 ? 503 : inferRes.status,
        )
      }

      const { event_id } = await inferRes.json()

      for (let i = 0; i < 180; i++) {
        const pollRes = await fetch(
          `${SPACE_HOST}/gradio_api/call/infer/${event_id}`,
        )

        const text = await pollRes.text()

        if (text.includes('event: complete')) {
          const match = text.match(/data:\s*(\[.*?\])\s*\n/)
          if (match) {
            const parsed = JSON.parse(match[1])
            const output = parsed?.[0]
            return await resolveOutput(output)
          }
        }

        if (pollRes.status === 503) {
          throw new ApiError('Le GPU demarre (30-60s)', 503)
        }

        await new Promise((r) => setTimeout(r, 1000))
      }

      throw new ApiError('Temps depasse (3 min)')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 503 && attempt < delays.length) {
          onRetry?.(attempt + 1, Math.round(delays[attempt] / 1000))
          await new Promise((r) => setTimeout(r, delays[attempt]))
          attempt++
          continue
        }
        throw err
      }
      if (err instanceof Error) throw new ApiError(err.message)
      throw new ApiError('Une erreur est survenue')
    }
  }
}

async function resolveOutput(output: unknown): Promise<string> {
  if (typeof output === 'string') {
    if (output.startsWith('http')) {
      const r = await fetch(output)
      const b = await r.blob()
      return await blobToDataURL(b)
    }
    return output
  }
  if (output && typeof output === 'object') {
    const obj = output as Record<string, unknown>
    const url = obj.url || (obj as any).path
    if (typeof url === 'string') {
      const fullUrl = url.startsWith('http') ? url : SPACE_HOST + url
      const r = await fetch(fullUrl)
      const b = await r.blob()
      return await blobToDataURL(b)
    }
  }
  throw new ApiError('Format reponse: ' + JSON.stringify(output).slice(0, 200))
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}
