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
    <div className="card transition-all duration-200 flex flex-col">
      <h2 className="text-lg font-heading font-bold text-miku-text dark:text-slate-100 mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-miku" />
        Mikufication
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
              <p className="text-miku-muted text-sm font-medium">
                Miku Miku Beam~
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
            alt="Mikufiee"
            className="w-full h-full object-contain animate-scale-in"
          />
        ) : (
          <div className="text-center p-8">
            <Sparkles className="w-10 h-10 text-slate-200 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 dark:text-slate-500 text-sm font-body">
              {hasImage
                ? 'Prete pour la mikufication'
                : 'En attente d\'une image...'}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={!hasImage || status === 'loading'}
        className={`mt-6 w-full py-4 text-lg font-heading font-bold flex items-center justify-center gap-3 cursor-pointer ${
          !hasImage || status === 'loading'
            ? 'btn-miku:disabled'
            : 'btn-miku'
        }`}
      >
        {status === 'loading' ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
        {status === 'loading'
          ? 'Miku Miku Beam~'
          : status === 'success'
            ? 'Re-mikufier'
            : 'Mikufier'}
      </button>

      {result && (
        <button
          onClick={onDownload}
          className="mt-3 w-full py-3.5 text-base font-heading font-bold flex items-center justify-center gap-3 cursor-pointer btn-dark"
        >
          <Download className="w-5 h-5" />
          Telecharger
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs border-2 border-red-100 dark:border-red-800/50 text-center flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
