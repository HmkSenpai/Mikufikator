import { Client, handle_file } from '@gradio/client'

const SPACE = 'Onise/Qwen-Image-Edit-2509-LoRAs-Fast2'

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
      const app = await Client.connect(SPACE)

      const imageFile = new File([base64ToBlob(imageBase64)], 'image.jpg', { type: 'image/jpeg' })
      const result = await app.predict('/infer', [
        handle_file(imageFile),
        prompt,
        0,
        true,
        1.0,
        4,
        'worst quality, low quality, bad anatomy, text, watermark',
        null, 1.0, null, 1.0, null, 1.0, null, 1.0, null, 1.0, null, 1.0,
      ])

      const output = (result.data as unknown[])[0]
      if (!output) throw new ApiError('Reponse vide')

      return await resolveOutput(output)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : err instanceof Object
              ? JSON.stringify(err)
              : String(err)

      if (err instanceof ApiError) {
        if ((err.code === 503 || msg.includes('loading')) && attempt < delays.length) {
          onRetry?.(attempt + 1, Math.round(delays[attempt] / 1000))
          await new Promise((r) => setTimeout(r, delays[attempt]))
          attempt++
          continue
        }
        throw err
      }

      throw new ApiError(msg)
    }
  }
}

function base64ToBlob(b64: string): Blob {
  const bin = atob(b64)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
  return new Blob([u8], { type: 'image/jpeg' })
}

async function resolveOutput(output: unknown): Promise<string> {
  if (typeof output === 'string') {
    if (output.startsWith('http')) {
      return blobToDataURL(await (await fetch(output)).blob())
    }
    return output
  }
  if (output && typeof output === 'object') {
    const obj = output as Record<string, unknown>
    const url = (obj.url || (obj as any).path || (obj as any).name) as
      | string
      | undefined
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://hf.space${url.startsWith('/') ? url : '/file=' + url}`
      return blobToDataURL(await (await fetch(fullUrl)).blob())
    }
    const data = obj.data as string | undefined
    if (data) return data
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
