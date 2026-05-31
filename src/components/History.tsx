import { Clock, Trash2, X } from 'lucide-react'
import type { HistoryItem } from '../types'
import { formatDate } from '../lib/imageUtils'

interface HistoryProps {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onRemove: (id: string) => void
  onClear: () => void
}

export default function History({
  items,
  onSelect,
  onRemove,
  onClear,
}: HistoryProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-cyan-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Historique
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          Tout effacer
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="relative shrink-0 group">
            <button
              onClick={() => onSelect(item)}
              className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-miku transition-all cursor-pointer"
            >
              <img
                src={item.result}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Supprimer"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-[9px] text-slate-400 text-center mt-1">
              {formatDate(item.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
