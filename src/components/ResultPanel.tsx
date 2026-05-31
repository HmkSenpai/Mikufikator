import { Music, Download, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'
import type { Status } from '../types'

interface ResultPanelProps {
  status: Status
  result: string | null
  error: string | null
  retryAttempt: number
  hasImage: boolean
  onGenerate: () => void
  onDownload: () => void
}

export default function ResultPanel({
  status,
  result,
  error,
  retryAttempt,
  hasImage,
  onGenerate,
  onDownload,
}: ResultPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-cyan-100 dark:border-slate-700 flex flex-col">
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-miku" />
        Étape 2 : Résultat final
      </h2>

      <div className="flex-1 aspect-square w-full border-2 border-slate-100 dark:border-slate-700 rounded-3xl relative flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        {status === 'loading' ? (
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-miku/30 border-t-miku rounded-full animate-spin" />
              {retryAttempt > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-miku">
                    {retryAttempt}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                L'IA analyse la structure...
              </p>
              {retryAttempt > 0 && (
                <p className="text-slate-400 text-xs mt-1">
                  Tentative {retryAttempt}/5...
                </p>
              )}
            </div>
          </div>
        ) : result ? (
          <img
            src={result}
            alt="Miku Result"
            className="w-full h-full object-contain animate-scale-in"
          />
        ) : (
          <div className="text-center p-8">
            <Sparkles className="w-10 h-10 text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 dark:text-slate-500 text-sm">
              {hasImage
                ? 'Prêt pour la transformation !'
                : 'En attente d\'une image...'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={!hasImage || status === 'loading'}
        className={`mt-6 w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
          !hasImage || status === 'loading'
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
            : 'bg-miku text-white shadow-md hover:bg-miku-dark active:scale-95'
        }`}
      >
        {status === 'loading' ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
        {status === 'loading'
          ? 'Traitement...'
          : status === 'success'
            ? 'Regénérer'
            : 'Ajouter les cheveux'}
      </button>

      {result && (
        <button
          onClick={onDownload}
          className="mt-3 w-full py-3.5 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-700 dark:hover:bg-slate-600 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          Enregistrer l'image
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs border border-red-100 dark:border-red-800 text-center flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
