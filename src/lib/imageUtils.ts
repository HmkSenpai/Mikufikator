export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function compressImage(
  dataUrl: string,
  maxWidth = 1024,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

export function dataURLToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1]
}

export function generatePlaceholder(id: string): string {
  const schemes: Record<string, { bg: string; fg: string; draw: (ctx: CanvasRenderingContext2D) => void }> = {
    cat: {
      bg: '#fbbf24',
      fg: '#92400e',
      draw(ctx) {
        ctx.beginPath()
        ctx.arc(150, 170, 50, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(120, 110, 28, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(180, 110, 28, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(100, 90)
        ctx.lineTo(85, 55)
        ctx.lineTo(115, 80)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(200, 90)
        ctx.lineTo(215, 55)
        ctx.lineTo(185, 80)
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(120, 105, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(180, 105, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1e293b'
        ctx.beginPath()
        ctx.arc(120, 105, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(180, 105, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(150, 180, 8, 0, Math.PI)
        ctx.stroke()
      },
    },
    person: {
      bg: '#60a5fa',
      fg: '#1e3a5f',
      draw(ctx) {
        ctx.beginPath()
        ctx.arc(150, 90, 38, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(150, 210, 55, 80, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(135, 82, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(165, 82, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1e3a5f'
        ctx.beginPath()
        ctx.arc(135, 82, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(165, 82, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#1e3a5f'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(150, 102, 12, 0.1, Math.PI - 0.1)
        ctx.stroke()
      },
    },
    object: {
      bg: '#a78bfa',
      fg: '#4c1d95',
      draw(ctx) {
        ctx.fillRect(80, 130, 140, 100)
        ctx.beginPath()
        ctx.moveTo(70, 130)
        ctx.lineTo(150, 70)
        ctx.lineTo(230, 130)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#fcd34d'
        ctx.fillRect(125, 170, 50, 60)
        ctx.fillStyle = '#4c1d95'
        ctx.fillRect(125, 170, 50, 8)
        ctx.fillRect(125, 222, 50, 8)
      },
    },
  }

  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 300
  const ctx = canvas.getContext('2d')!
  const s = schemes[id] || schemes.object

  const grad = ctx.createLinearGradient(0, 0, 300, 300)
  grad.addColorStop(0, s.bg)
  grad.addColorStop(1, s.bg + '99')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 300, 300)

  ctx.fillStyle = s.fg + '33'
  ctx.fillRect(0, 0, 300, 300)
  ctx.fillStyle = s.fg
  s.draw(ctx)

  return canvas.toDataURL('image/png')
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}
