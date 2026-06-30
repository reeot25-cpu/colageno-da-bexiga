import { Link } from 'react-router-dom'
import { Coffee, UtensilsCrossed, ChevronRight, Sparkles, Settings } from 'lucide-react'
import IconAssoalhoPelvico from '../components/IconAssoalhoPelvico'
import { useProgresso } from '../hooks/useProgresso'
import { frases, diasRitual } from '../data/ritual'

const fraseHoje = frases[new Date().getDay() % frases.length]

const atalhos = [
  { to: '/chas',       label: 'Chás',       emoji: '🍵', bg: '#E8E0F8', cor: '#6B4EA8' },
  { to: '/receitas',   label: 'Receitas',   emoji: '🥗', bg: '#EAE0FA', cor: '#7B5AA8' },
  { to: '/exercicios', label: 'Exercícios', emoji: null,  Icone: IconAssoalhoPelvico, bg: '#EDE0F8', cor: '#6B4EA8' },
]

export default function Inicio() {
  const { diaAtivo, progressoDia, progressoGeral, estado } = useProgresso()
  const prog = progressoDia(diaAtivo)
  const geral = progressoGeral()

  const tarefasHoje = diasRitual[diaAtivo - 1]?.tarefas ?? []
  const proximaTarefa = tarefasHoje.find((t) => !estado.concluidas[t.id])
  const pctRitual = Math.round((geral.diasCompletos / 7) * 100)

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <span className="font-titulo text-[#6B4EA8] text-2xl font-bold tracking-tight">CollagenFlow</span>
        <Link to="/configuracoes" className="p-2 rounded-full bg-white shadow-sm border border-[#D8CCF0]">
          <Settings size={20} className="text-[#9B7AD6]" />
        </Link>
      </div>

      {/* Saudação */}
      <div>
        <h1 className="font-titulo text-2xl text-[#3D2B6B] leading-tight">
          Olá! Que bom<br />te ver por aqui
        </h1>
        <p className="text-[#7B6B9A] mt-1 text-base">{fraseHoje}</p>
      </div>

      {/* Card Ritual 7 Dias */}
      <Link to="/progresso" className="block">
        <div className="bg-[#9B7AD6] rounded-2xl p-5 shadow-md text-white">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Seu Ritual</p>
              <h2 className="font-titulo text-2xl font-bold">Dia {diaAtivo} de 7</h2>
            </div>
            {/* Círculo de percentual */}
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="white" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  strokeDashoffset={`${2 * Math.PI * 15 * (1 - pctRitual / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{pctRitual}%</span>
              </div>
            </div>
          </div>

          {/* Barra dos 7 dias */}
          <div className="flex gap-1 mb-2 mt-3">
            {Array.from({ length: 7 }, (_, i) => {
              const d = i + 1
              const p = progressoDia(d)
              const completo = p.feitas === p.total && p.total > 0
              const atual = d === diaAtivo
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      completo ? 'bg-white' : atual ? 'bg-white/50' : 'bg-white/20'
                    }`}
                  />
                  <span className="text-[9px] text-white/60">{d}</span>
                </div>
              )
            })}
          </div>

          <p className="text-[#D4C0F0] text-sm mt-1">
            {geral.diasCompletos} de 7 dias completos · {geral.feitas}/{geral.total} tarefas →
          </p>
        </div>
      </Link>

      {/* Tarefa de hoje */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#B8A0E0]" />
            <p className="font-semibold text-[#3D2B6B] text-base">Hoje</p>
          </div>
          <span className="text-sm font-bold text-[#9B7AD6]">
            {prog.feitas}/{prog.total} tarefas
          </span>
        </div>

        {proximaTarefa ? (
          <Link to="/progresso" className="flex items-center gap-3 bg-[#F5F0FF] rounded-xl p-3 mb-3">
            <span className="text-2xl">{proximaTarefa.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-[#3D2B6B]">{proximaTarefa.label}</p>
              <p className="text-[#7B6B9A] text-sm">{proximaTarefa.horario}</p>
            </div>
            <ChevronRight size={18} className="text-[#9B7AD6]" />
          </Link>
        ) : (
          <div className="bg-[#E8E0F8] rounded-xl p-3 text-center mb-3">
            <p className="text-[#6B4EA8] font-semibold">🎉 Dia {diaAtivo} completo!</p>
          </div>
        )}

        {/* Barra do dia com segmentos por tarefa */}
        <div className="flex gap-1">
          {tarefasHoje.map((t) => (
            <div
              key={t.id}
              title={t.label}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                estado.concluidas[t.id] ? 'bg-[#9B7AD6]' : 'bg-[#E8E0F8]'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#7B6B9A] mt-1 text-right">
          {prog.feitas === prog.total && prog.total > 0
            ? '✓ Tudo feito hoje!'
            : `Faltam ${prog.total - prog.feitas} tarefas`}
        </p>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-3 gap-3">
        {atalhos.map(({ to, label, emoji, Icone, bg, cor }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl shadow-sm"
            style={{ backgroundColor: bg }}
          >
            {Icone
              ? <Icone size={34} strokeWidth={1.6} style={{ color: cor }} />
              : <span className="text-3xl">{emoji}</span>
            }
            <span className="text-sm font-semibold" style={{ color: cor }}>{label}</span>
          </Link>
        ))}
      </div>

      {/* Em breve */}
      <div className="bg-[#EDE7F9] rounded-2xl p-4 border border-dashed border-[#B8A0E0]">
        <p className="text-[#9B8BBB] text-sm text-center">
          ✨ <strong>Em breve:</strong> mais exercícios e acompanhamento personalizado
        </p>
      </div>

      <Link to="/aviso" className="text-center text-xs text-[#9B8BBB] underline underline-offset-2 pb-2">
        Aviso importante
      </Link>
    </div>
  )
}
