import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  dark: boolean
  onToggleDark: () => void
}

function MikuLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-10 h-10"
      aria-hidden="true"
    >
      <circle cx="24" cy="26" r="10" fill="white" />
      <path
        d="M14 14C10 10 4 12 6 18C7 21 12 24 16 22"
        fill="white"
      />
      <path
        d="M34 14C38 10 44 12 42 18C41 21 36 24 32 22"
        fill="white"
      />
      <path
        d="M6 18C4 24 8 30 14 28"
        stroke="#7eddd6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M42 18C44 24 40 30 34 28"
        stroke="#7eddd6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="1.5" fill="#f9a8d4" />
      <circle cx="34" cy="14" r="1.5" fill="#f9a8d4" />
    </svg>
  )
}

export default function Header({ dark, onToggleDark }: HeaderProps) {
  return (
    <header className="max-w-6xl w-full text-center mb-8 relative">
      <button
        onClick={onToggleDark}
        className="absolute right-0 top-0 p-2 rounded-xl text-miku-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Basculer le mode sombre"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-miku p-2.5 rounded-2xl shadow-[0_5px_0_0_#2baaa1] rotate-3 hover:rotate-6 transition-transform duration-300">
          <MikuLogo />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-miku-text dark:text-white tracking-tight">
          Miku<span className="text-miku">ficator</span>
        </h1>
      </div>
      <p className="text-miku-muted text-sm md:text-base font-body">
        Transformez n'importe quelle image en Miku :D
      </p>
    </header>
  )
}
