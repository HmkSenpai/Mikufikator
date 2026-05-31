import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Info } from 'lucide-react'
import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import ResultPanel from './components/ResultPanel'
import Gallery from './components/Gallery'
import History from './components/History'
import Footer from './components/Footer'
import { useGemini } from './hooks/useGemini'
import { useHistory } from './hooks/useHistory'
import { useDarkMode } from './hooks/useDarkMode'
import { PROMPT } from './lib/constants'
import { readFileAsBase64, compressImage, dataURLToBase64 } from './lib/imageUtils'
import type { HistoryItem } from './types'

export default function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const { dark, toggle: toggleDark } = useDarkMode()
  const { items: history, add: addHistory, clear: clearHistory, remove: removeHistory } = useHistory()
  const lastResultRef = useRef<string | null>(null)

  const gemini = useGemini()

  useEffect(() => {
    if (gemini.result && gemini.result !== lastResultRef.current) {
      lastResultRef.current = gemini.result
      addHistory({
        source: previewUrl || '',
        result: gemini.result,
        prompt: PROMPT,
      })
    }
  }, [gemini.result, previewUrl, addHistory])

  const handleImageReady = useCallback((base64: string, preview: string) => {
    setImage(base64)
    setPreviewUrl(preview)
    gemini.reset()
  }, [gemini])

  const handleClearImage = useCallback(() => {
    setImage(null)
    setPreviewUrl(null)
    gemini.reset()
  }, [gemini])

  const handleGenerate = useCallback(async () => {
    if (!image) return
    await gemini.run(image, PROMPT)
  }, [image, gemini])

  const handleDownload = useCallback(() => {
    if (!gemini.result) return
    const link = document.createElement('a')
    link.href = gemini.result
    link.download = 'mikuficated.png'
    link.click()
  }, [gemini.result])

  const handleGallerySelect = useCallback(
    async (url: string) => {
      try {
        const resp = await fetch(url)
        const blob = await resp.blob()
        const file = new File([blob], 'gallery.jpg', { type: blob.type })
        const dataUrl = await compressImage(URL.createObjectURL(file))
        const base64 = dataURLToBase64(dataUrl)
        setImage(base64)
        setPreviewUrl(dataUrl)
        gemini.reset()
      } catch {
        // fallback silencieux
      }
    },
    [gemini],
  )

  const handleHistorySelect = useCallback(
    (item: HistoryItem) => {
      setImage(item.source)
      setPreviewUrl(item.source)
    },
    [],
  )

  const apiKeyMissing = useMemo(
    () => !import.meta.env.VITE_GEMINI_API_KEY,
    [],
  )

  return (
    <div className="min-h-screen bg-[#f0f9fa] dark:bg-slate-950 flex flex-col items-center p-4 md:p-8 transition-colors duration-300">
      <Header dark={dark} onToggleDark={toggleDark} />

      {apiKeyMissing && (
        <div className="max-w-6xl w-full mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-700 dark:text-amber-400 text-sm flex items-center gap-3">
          <Info className="w-5 h-5 shrink-0" />
          <span>
            <strong>Clé API manquante.</strong> Copiez le fichier{' '}
            <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">
              .env.example
            </code>{' '}
            en <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">.env</code>{' '}
            et ajoutez votre clé Gemini.
          </span>
        </div>
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ImageUploader
            onImageReady={handleImageReady}
            disabled={gemini.status === 'loading'}
            previewUrl={previewUrl}
            onClear={handleClearImage}
          />

          <div className="bg-cyan-50 dark:bg-cyan-900/10 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-800/30 flex gap-3">
            <Info className="w-5 h-5 text-miku shrink-0" />
            <p className="text-xs text-cyan-800 dark:text-cyan-200 leading-relaxed">
              Glissez une photo, cliquez sur "Ajouter les cheveux", et laissez
              l'IA poser les couettes de Miku sur votre sujet&nbsp;!
            </p>
          </div>

          <Gallery onSelect={handleGallerySelect} disabled={gemini.status === 'loading'} />
        </div>

        <div className="space-y-4">
          <ResultPanel
            status={gemini.status}
            result={gemini.result}
            error={gemini.error}
            retryAttempt={gemini.retryAttempt}
            hasImage={!!image}
            onGenerate={handleGenerate}
            onDownload={handleDownload}
          />

          <History
            items={history}
            onSelect={handleHistorySelect}
            onRemove={removeHistory}
            onClear={clearHistory}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
