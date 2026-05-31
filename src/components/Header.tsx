import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  dark: boolean
  onToggleDark: () => void
}

export default function Header({ dark, onToggleDark }: HeaderProps) {
  return (
    <header className="max-w-6xl w-full text-center mb-8 relative">
      <button
        onClick={onToggleDark}
        className="absolute right-0 top-0 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Basculer le mode sombre"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-miku p-3 rounded-2xl shadow-lg rotate-3 hover:rotate-6 transition-transform text-2xl">
          🎤
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
          MIKU<span className="text-miku">FICATOR</span>
        </h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
        Transformez n'importe quelle image avec les couettes de Miku ✨
      </p>
    </header>
  )
}
