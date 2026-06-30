import { NavLink } from 'react-router-dom'
import { Home, Coffee, UtensilsCrossed, TrendingUp, BookHeart } from 'lucide-react'
import IconAssoalhoPelvico from './IconAssoalhoPelvico'

const abas = [
  { to: '/',           label: 'Início',    Icon: Home },
  { to: '/chas',       label: 'Chás',      Icon: Coffee },
  { to: '/receitas',   label: 'Receitas',  Icon: UtensilsCrossed },
  { to: '/exercicios', label: 'Exerc.',    Icon: IconAssoalhoPelvico },
  { to: '/diario',     label: 'Diário',    Icon: BookHeart },
  { to: '/progresso',  label: 'Progresso', Icon: TrendingUp },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D8CCF0] shadow-lg safe-area-pb">
      <div className="flex max-w-lg mx-auto">
        {abas.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors ${
                isActive ? 'text-[#9B7AD6]' : 'text-[#C9B3ED]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                <span className="text-[9px] font-semibold leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
