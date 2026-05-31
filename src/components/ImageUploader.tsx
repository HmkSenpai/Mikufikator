import { useState, useRef, useCallback } from 'react'
import { Upload, ImageIcon, X } from 'lucide-react'
import { readFileAsBase64, readFileAsDataURL, compressImage } from '../lib/imageUtils'
import { MAX_IMAGE_SIZE } from '../lib/constants'

interface ImageUploaderProps {
  onImageReady: (base64: string, previewUrl: string) => void
  disabled: boolean
  previewUrl: string | null
  onClear: () => void
}

export default function ImageUploader({
  onImageReady,
  disabled,
  previewUrl,
  onClear,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez choisir une image.')
        return
      }

      if (file.size > MAX_IMAGE_SIZE * 2) {
        alert(`L'image est trop lourde. Maximum : ${MAX_IMAGE_SIZE / 1024 / 1024} Mo`)
        return
      }

      setProcessing(true)
      try {
        const dataUrl = await readFileAsDataURL(file)
        const compressed = await compressImage(dataUrl)
        const base64 = compressed.split(',')[1]
        onImageReady(base64, compressed)
      } catch {
        alert('Erreur lors de la lecture du fichier.')
      } finally {
        setProcessing(false)
      }
    },
    [onImageReady],
  )

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      e.target.value = ''
    },
    [processFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragOver(false), [])

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-cyan-100 dark:border-slate-700">
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-miku" />
        Étape 1 : Choisir une image
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`aspect-square w-full border-4 border-dashed rounded-3xl relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          dragOver
            ? 'border-miku bg-miku/5 scale-[1.02]'
            : previewUrl
              ? 'border-slate-200 dark:border-slate-600'
              : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50'
        }`}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Source"
              className="w-full h-full object-contain"
            />
            {!disabled && (
              <button
                onClick={onClear}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                aria-label="Supprimer l'image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="text-center p-6">
            {processing ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-3 border-miku border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm">Compression...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  {dragOver
                    ? 'Déposez ici...'
                    : 'Cliquez ou glissez une image'}
                </p>
                <p className="text-slate-300 dark:text-slate-600 text-[10px] mt-1">
                  Humain, chat, objet... tout fonctionne&nbsp;!
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={disabled || processing}
        />
      </div>
    </div>
  )
}
