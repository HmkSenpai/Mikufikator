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
    <div className="card transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-heading font-bold text-miku-muted uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Historique
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer font-body"
        >
          <Trash2 className="w-3 h-3" />
          Tout effacer
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <div key={item.id} className="relative shrink-0 group">
            <button
              onClick={() => onSelect(item)}
              className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-miku transition-all duration-200 cursor-pointer"
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
            <p className="text-[9px] text-miku-muted text-center mt-1 font-body">
              {formatDate(item.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
