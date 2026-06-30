import { Link } from 'react-router-dom'
import { Coffee, UtensilsCrossed, Activity, ChevronRight, Sparkles } from 'lucide-react'
import { useProgresso } from '../hooks/useProgresso'
import { frases, diasRitual } from '../data/ritual'

const fraseHoje = frases[new Date().getDay() % frases.length]

const atalhos = [
  { to: '/chas',       label: 'Chás',       emoji: '🍵', bg: '#E8E0F8', cor: '#6B4EA8' },
  { to: '/receitas',   label: 'Receitas',   emoji: '🥗', bg: '#EAE0FA', cor: '#7B5AA8' },
  { to: '/exercicios', label: 'Exercícios', emoji: '💪', bg: '#EDE0F8', cor: '#6B4EA8' },
]

export default function Inicio() {
  const { diaAtivo, progressoDia, estado } = useProgresso()
  const prog = progressoDia(diaAtivo)

  const tarefasHoje = diasRitual[diaAtivo - 1]?.tarefas ?? []
  const proximaTarefa = tarefasHoje.find((t) => !estado.concluidas[t.id])

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-32 max-w-lg mx-auto">
      {/* Cabeçalho com nome do app */}
      <div className="flex items-center justify-between">
        <span className="font-titulo text-[#6B4EA8] text-2xl font-bold tracking-tight">CollagenFlow</span>
        <span className="text-2xl">🌿</span>
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
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[#D4C0F0] text-sm font-semibold uppercase tracking-wide">Seu Ritual</p>
              <h2 className="font-titulo text-2xl font-bold">Dia {diaAtivo} de 7</h2>
            </div>
            <div className="text-4xl">🌸</div>
          </div>
          <div className="bg-[#7B5AB8] rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${(diaAtivo - 1) / 7 * 100}%` }}
            />
          </div>
          <p className="text-[#D4C0F0] text-sm mt-2">{diaAtivo - 1} de 7 dias completos • Ver detalhes →</p>
        </div>
      </Link>

      {/* Tarefa de hoje */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#D8CCF0]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-[#B8A0E0]" />
          <p className="font-semibold text-[#3D2B6B] text-base">Tarefa de hoje</p>
        </div>
        {proximaTarefa ? (
          <Link to="/progresso" className="flex items-center gap-3 bg-[#F5F0FF] rounded-xl p-3">
            <span className="text-2xl">{proximaTarefa.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-[#3D2B6B]">{proximaTarefa.label}</p>
              <p className="text-[#7B6B9A] text-sm">{proximaTarefa.horario}</p>
            </div>
            <ChevronRight size={18} className="text-[#9B7AD6]" />
          </Link>
        ) : (
          <div className="bg-[#E8E0F8] rounded-xl p-3 text-center">
            <p className="text-[#6B4EA8] font-semibold">🎉 Dia {diaAtivo} completo!</p>
          </div>
        )}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#7B6B9A] mb-1">
            <span>Progresso de hoje</span>
            <span>{prog.feitas}/{prog.total}</span>
          </div>
          <div className="bg-[#E8E0F8] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#9B7AD6] h-full rounded-full transition-all duration-500"
              style={{ width: `${prog.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-3 gap-3">
        {atalhos.map(({ to, label, emoji, bg, cor }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl shadow-sm"
            style={{ backgroundColor: bg }}
          >
            <span className="text-3xl">{emoji}</span>
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

      {/* Rodapé aviso */}
      <Link to="/aviso" className="text-center text-xs text-[#9B8BBB] underline underline-offset-2 pb-2">
        Aviso importante
      </Link>
    </div>
  )
}
