import { GALLERY_ITEMS } from '../lib/constants'

interface GalleryProps {
  onSelect: (url: string) => void
  disabled: boolean
}

export default function Gallery({ onSelect, disabled }: GalleryProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-cyan-100 dark:border-slate-700">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Exemples
      </h3>
      <div className="flex gap-3">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.src)}
            disabled={disabled}
            className="flex-1 aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-miku hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <img
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="block text-[10px] text-center text-slate-400 mt-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-2 text-center">
        Cliquez pour essayer — image générée sur place
      </p>
    </div>
  )
}
