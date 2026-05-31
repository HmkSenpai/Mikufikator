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

function base64ToBlob(b64: string): Blob {
  const bin = atob(b64)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
  return new Blob([u8], { type: 'image/jpeg' })
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
      const imgBlob = base64ToBlob(imageBase64)

      const uploadForm = new FormData()
      uploadForm.append('files', imgBlob, 'image.jpg')

      const uploadRes = await fetch(`${SPACE_HOST}/gradio_api/upload`, {
        method: 'POST',
        body: uploadForm,
      })
      if (!uploadRes.ok) {
        throw new ApiError(`Upload: ${uploadRes.status}`, uploadRes.status)
      }

      const uploaded: { url: string }[] = await uploadRes.json()
      const fileRef = { path: uploaded[0].url }

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
            null, 1.0, null, 1.0, null, 1.0, null, 1.0, null, 1.0, null, 1.0,
          ],
        }),
      })
      if (!inferRes.ok) {
        const is503 = inferRes.status === 503
        throw new ApiError(
          is503 ? 'Le GPU demarre' : `Erreur ${inferRes.status}`,
          is503 ? 503 : inferRes.status,
        )
      }

      const { event_id } = await inferRes.json()

      const output = await waitForEvent(event_id)
      return await resolveOutput(output)
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

async function waitForEvent(eventId: string): Promise<unknown> {
  const url = `${SPACE_HOST}/gradio_api/call/infer/${eventId}`
  const response = await fetch(url)
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  return new Promise((resolve, reject) => {
    let eventType = ''
    let timedOut = false

    const timeout = setTimeout(() => {
      timedOut = true
      reader.cancel()
      reject(new ApiError("Temps d'attente depasse (3 min)", 408))
    }, 180_000)

    function pump(): void {
      reader.read().then(({ done, value }) => {
        if (timedOut) return
        if (done) {
          clearTimeout(timeout)
          reject(new ApiError('Connexion fermee prematurement'))
          return
        }

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n')

        for (let i = 0; i < parts.length - 1; i++) {
          const line = parts[i].trim()

          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim()
          } else if (line.startsWith('data: ')) {
            const raw = line.slice(6)
            if (eventType === 'complete') {
              clearTimeout(timeout)
              reader.cancel()
              try {
                resolve(JSON.parse(raw)[0])
              } catch {
                reject(new ApiError('Erreur de parsing SSE'))
              }
              return
            }
            eventType = ''
          }
        }

        buffer = parts[parts.length - 1]
        pump()
      }).catch((err) => {
        clearTimeout(timeout)
        reject(new ApiError('Erreur de lecture SSE: ' + err.message))
      })
    }

    pump()
  })
}

async function resolveOutput(output: unknown): Promise<string> {
  if (typeof output === 'string') {
    if (output.startsWith('http')) {
      const r = await fetch(output)
      return blobToDataURL(await r.blob())
    }
    return output
  }
  if (output && typeof output === 'object') {
    const obj = output as Record<string, unknown>
    const url = (obj.url || (obj as any).path) as string | undefined
    if (url) {
      const fullUrl = url.startsWith('http') ? url : SPACE_HOST + url
      const r = await fetch(fullUrl)
      return blobToDataURL(await r.blob())
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
