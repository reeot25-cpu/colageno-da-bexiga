import { NavLink } from 'react-router-dom'
import { Home, Coffee, UtensilsCrossed, Activity, TrendingUp } from 'lucide-react'

const abas = [
  { to: '/',          label: 'Início',    Icon: Home },
  { to: '/chas',      label: 'Chás',      Icon: Coffee },
  { to: '/receitas',  label: 'Receitas',  Icon: UtensilsCrossed },
  { to: '/exercicios',label: 'Exercícios',Icon: Activity },
  { to: '/progresso', label: 'Progresso', Icon: TrendingUp },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8DDD0] shadow-lg safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {abas.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors ${
                isActive ? 'text-[#C66B5A]' : 'text-[#B0A090]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
