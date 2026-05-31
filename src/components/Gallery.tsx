import { GALLERY_ITEMS } from '../lib/constants'

interface GalleryProps {
  onSelect: (id: string) => void
  disabled: boolean
}

export default function Gallery({ onSelect, disabled }: GalleryProps) {
  return (
    <div className="card transition-all duration-200">
      <h3 className="text-xs font-heading font-bold text-miku-muted uppercase tracking-wider mb-3">
        Exemples
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            disabled={disabled}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-transparent hover:border-miku hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer p-1"
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden">
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] text-miku-muted font-body">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-2 text-center font-body">
        Essayez sur ces images
      </p>
    </div>
  )
}
