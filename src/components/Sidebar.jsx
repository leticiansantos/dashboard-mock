import { Map, LayoutDashboard, Users, Lightbulb, Dumbbell, TrendingDown } from 'lucide-react'

const navItems = [
  { id: 'map', label: 'Mapa Tático', icon: Map },
  { id: 'dashboard', label: 'KPIs & Resultados', icon: LayoutDashboard },
  { id: 'competitors', label: 'Concorrentes', icon: Users },
  { id: 'recommendations', label: 'Recomendações', icon: Lightbulb },
  { id: 'churn', label: 'Churn & Retenção', icon: TrendingDown },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Dumbbell size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Voi Fit</p>
            <p className="text-xs text-slate-400 leading-tight">Itaim Paulista</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Inteligência Tática
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Sprint 30 Dias — Ativo</span>
        </div>
        <p className="text-xs text-slate-600">Abril 2026</p>
      </div>
    </aside>
  )
}
